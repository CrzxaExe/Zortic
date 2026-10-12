import { BaseDirectory, exists, mkdir, readDir, readTextFile, remove, writeTextFile } from "@tauri-apps/plugin-fs";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useNotesStore = defineStore("notes", async () => {
    const list = ref<Note[]>([]);
    const activeNote = ref<Note | null>(null);
    const isLoading = ref(false);

    const FOLDER_NAME = "notes";

    async function initFolder() {
    try {
      const folderExists = await exists(FOLDER_NAME, { baseDir: BaseDirectory.AppLocalData });
      if (!folderExists) {
        await mkdir(FOLDER_NAME, { baseDir: BaseDirectory.AppLocalData, recursive: true });
      }
    } catch (error) {
      console.error("Failed to initialize folder:", error);
    }
  }

  async function loadAllNotes() {
    isLoading.value = true;
    list.value = [];

    try {
      await initFolder();
      const entries = await readDir(FOLDER_NAME, { baseDir: BaseDirectory.AppLocalData });
      
      for (const entry of entries) {
        if (entry.isFile && entry.name.endsWith('.md')) {
          const filePath = `${FOLDER_NAME}/${entry.name}`;
          const content = await readTextFile(filePath, { baseDir: BaseDirectory.AppLocalData });
          
          list.value.push({
            filename: entry.name,
            title: entry.name.replace('.md', ''), 
            content: content
          });
        }
      }
    } catch (error: unknown) {
      if(error instanceof Error) console.error("Failed to load note:", error);
    } finally {
      isLoading.value = false;
    }
  }

  async function saveNote(title: string, content: string) {
    try {
      const safeTitle = title.replace(/[^a-zA-Z0-9 -]/g, "");
      const filename = `${safeTitle}.md`;
      const filePath = `${FOLDER_NAME}/${filename}`;

      await writeTextFile(filePath, content, { baseDir: BaseDirectory.AppLocalData });
      
      const existingIndex = list.value.findIndex(n => n.filename === filename);
      if (existingIndex !== -1) {
        list.value[existingIndex].content = content;
      } else {
        list.value.push({ filename, title: safeTitle, content });
      }

    } catch (error: unknown) {
      if(error instanceof Error) console.error("Failed to save note:", error);
    }
  }

  async function deleteNote(filename: string) {
    try {
      const filePath = `${FOLDER_NAME}/${filename}`;
      await remove(filePath, { baseDir: BaseDirectory.AppLocalData });
      
      list.value = list.value.filter(n => n.filename !== filename);
      
      if (activeNote.value && activeNote.value.filename === filename) {
        activeNote.value = null;
      }
    } catch (error: unknown) {
      if(error instanceof Error) console.error("Failed to delete note:", error);
    }
  }

  function setActiveNote(note: Note) {
    activeNote.value = note;
  }

    return {
        list,
        activeNote,

        initFolder,
        loadAllNotes,
        saveNote,
        deleteNote,
        setActiveNote,
    }
})
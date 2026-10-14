import { invoke } from "@tauri-apps/api/core";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useNotesStore = defineStore("notes", async () => {
  const list = ref<Note[]>([]);
  const activeNote = ref<Note | null>(null);
  const isLoading = ref(false);

  async function loadAllNotes() {
    isLoading.value = true;
    list.value = [];

    try {
      const entries = await invoke<Note[]>("get_all_notes");
      list.value = entries;
    } catch (error: unknown) {
      if(error instanceof Error) console.error("Failed to load note:", error);
    } finally {
      isLoading.value = false;
    }
  }

  async function saveNote(title: string, content: string) {
    try {
      const savedNote = await invoke<Note | null>("save_note", { title, content });
      if(!savedNote) throw new Error("Backend not response");
      
      const existingIndex = list.value.findIndex(n => n.filename === savedNote.filename);
      if (existingIndex !== -1) {
        list.value[existingIndex].title = title;
        list.value[existingIndex].content = content;
      } else {
        list.value.push(savedNote);
      }

    } catch (error: unknown) {
      if(error instanceof Error) console.error("Failed to save note:", error);
    }
  }

  async function deleteNote(filename: string) {
    try {
      await invoke('delete_note', { filename });
      
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

        loadAllNotes,
        saveNote,
        deleteNote,
        setActiveNote,
    }
})
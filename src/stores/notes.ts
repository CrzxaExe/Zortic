import { invoke } from "@tauri-apps/api/core";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useNotesStore = defineStore("notes", () => {
  const list = ref<Note[]>([]);
  const activeNote = ref<Note>({ title: '', content: '', filename: ''});
  const displayNote = ref<Note>({ title: '', content: '', filename: ''});
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

  async function saveNote(note: Note, callback?: (...args: any[]) => void) {
    if (activeNote.value.title.length < 1 || activeNote.value.content.length < 1) return

    try {
      const savedNote = await invoke<Note>("save_note", {
        filename: note.filename || null,
        title: note.title,
        content: note.content,
      });
      if(!savedNote) throw new Error("Backend not response");
      
      const existingIndex = list.value.findIndex(n => n.filename === note.filename);
      if (existingIndex !== -1) {
        list.value[existingIndex] = savedNote;
      } else {
        list.value.push(savedNote);
      }

      resetActiveNote()
      callback?.()

      return savedNote;
    } catch (error: unknown) {
      console.error("Failed to save note:", error);
      throw error;
    }
  }

  async function renameNote(oldNote: Note, newNote: Note) {
    return await saveNote({ ...newNote, filename: oldNote.filename });
  }

  async function deleteNote(filename: string) {
    try {
      await invoke('delete_note', { filename });
      
      list.value = list.value.filter(n => n.filename !== filename);
      if (activeNote.value && activeNote.value.filename === filename) {
        activeNote.value = { title: '', content: '', filename: ''};
      }
    } catch (error: unknown) {
      if(error instanceof Error) console.error("Failed to delete note:", error);
    }
  }

  function setActiveNote(note: Note) {
    activeNote.value = note;
  }

  function resetActiveNote() {
    activeNote.value = JSON.parse(JSON.stringify({ title: '', content: '', filename: '' }))
  }
  
  function setDisplayNote(note: Note) {
    displayNote.value = note;
  }

  function resetDisplayNote() {
    displayNote.value = JSON.parse(JSON.stringify({ title: '', content: '', filename: '' }))
  }

  return {
    list,
    activeNote,
    displayNote,

    loadAllNotes,
    saveNote,
    renameNote,
    deleteNote,
    setActiveNote,
    resetActiveNote,
    setDisplayNote,
    resetDisplayNote,
  }
})
<script lang="ts">
let globalZIndex = 99;
</script>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps({
    title: { type: String, default: "New Window" },
    initialX: { type: Number, default: 100 },
    initialY: { type: Number, default: 100 },
    actions: { type: Array<(Action & ActionFunction)>, default: [] },
})

const emit = defineEmits<{
    (e: "close"): void
}>()

const position = ref({ x: props.initialX, y: props.initialY })
const isDragging = ref(false)
const windowRef = ref<HTMLElement | null>(null)
const dragOffset = { x: 0, y: 0 }
const size = ref<{ width?: number; height?: number }>({})
type ResizeEdge = 'top' | 'right' | 'bottom' | 'left'
const resizeStart = ref<{
    edge: ResizeEdge
    pointerX: number
    pointerY: number
    left: number
    top: number
    width: number
    height: number
} | null>(null)

const localZIndex = ref(globalZIndex)

const bringToFront = () => {
    globalZIndex++
    localZIndex.value = globalZIndex
}

const constrainToViewport = () => {
    const element = windowRef.value
    if (!element) return

    const rect = element.getBoundingClientRect()
    position.value.x = clamp(position.value.x, 0, Math.max(0, window.innerWidth - rect.width))
    position.value.y = clamp(position.value.y, 0, Math.max(0, window.innerHeight - rect.height))
}

onMounted(() => {
    bringToFront()
    constrainToViewport()
    window.addEventListener('resize', constrainToViewport)
})

const onDrag = (event: MouseEvent) => {
    if (!isDragging.value || !windowRef.value) return

    let newX = event.clientX - dragOffset.x;
    let newY = event.clientY - dragOffset.y;

    if (newY <= 12) {
        newY = 0;
        size.value = { ...size.value, height: window.innerHeight };
    }

    const rect = windowRef.value.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width;
    const maxY = window.innerHeight - rect.height;

    position.value.x = Math.max(0, Math.min(newX, maxX));
    position.value.y = Math.max(0, Math.min(newY, maxY));
}

const stopDrag = () => {
    isDragging.value = false;
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
}

const startDrag = (event: MouseEvent) => {
    isDragging.value = true

    dragOffset.x = event.clientX - position.value.x
    dragOffset.y = event.clientY - position.value.y

    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', stopDrag)
}

const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(value, max))

const onResize = (event: PointerEvent) => {
    const start = resizeStart.value
    const element = windowRef.value
    if (!start || !element) return

    const deltaX = event.clientX - start.pointerX
    const deltaY = event.clientY - start.pointerY
    const minWidth = parseFloat(getComputedStyle(element).minWidth)
    const minHeight = parseFloat(getComputedStyle(element).minHeight)
    const maxWidth = Math.max(minWidth, window.innerWidth)
    const maxHeight = Math.max(minHeight, window.innerHeight)
    let width = start.width
    let height = start.height

    if (start.edge === 'right') {
        width = clamp(start.width + deltaX, minWidth, Math.max(minWidth, window.innerWidth - start.left))
    } else if (start.edge === 'left') {
        const right = start.left + start.width
        position.value.x = clamp(start.left + deltaX, Math.max(0, right - maxWidth), right - minWidth)
        width = right - position.value.x
    } else if (start.edge === 'bottom') {
        height = clamp(start.height + deltaY, minHeight, Math.max(minHeight, window.innerHeight - start.top))
    } else {
        const bottom = start.top + start.height
        position.value.y = clamp(start.top + deltaY, Math.max(0, bottom - maxHeight), bottom - minHeight)
        height = bottom - position.value.y
    }

    size.value = { width, height }
}

const stopResize = () => {
    resizeStart.value = null
    document.removeEventListener('pointermove', onResize)
    document.removeEventListener('pointerup', stopResize)
}

const startResize = (event: PointerEvent, edge: ResizeEdge) => {
    event.preventDefault()
    event.stopPropagation()

    const element = windowRef.value
    if (!element) return

    const rect = element.getBoundingClientRect()
    bringToFront()
    size.value = { width: rect.width, height: rect.height }
    resizeStart.value = {
        edge,
        pointerX: event.clientX,
        pointerY: event.clientY,
        left: position.value.x,
        top: position.value.y,
        width: rect.width,
        height: rect.height,
    }

    document.addEventListener('pointermove', onResize)
    document.addEventListener('pointerup', stopResize)
}

onBeforeUnmount(() => {
    stopResize()
    window.removeEventListener('resize', constrainToViewport)
})
</script>

<template>
    <div ref="windowRef" @mousedown="bringToFront"
        class="absolute flex flex-col min-w-120 min-h-34 max-h-screen overflow-x-hidden overflow-y-scroll" :style="{
            left: position.x + 'px',
            top: position.y + 'px',
            minWidth: `min(30rem, max(0px, calc(100vw - ${position.x}px)))`,
            minHeight: `min(8.5rem, max(0px, calc(100vh - ${position.y}px)))`,
            maxWidth: `max(0px, calc(100vw - ${position.x}px))`,
            maxHeight: `max(0px, calc(100vh - ${position.y}px))`,
            width: size.width ? size.width + 'px' : undefined,
            height: size.height ? size.height + 'px' : undefined,
            zIndex: localZIndex
        }">
        <div class="relative flex flex-1 min-h-0 w-full flex-col">
            <div class="w-full sticky top-0 z-1 flex justify-between backdrop-blur-lg px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg shadow-lg animatable"
                :class="isDragging ? 'cursor-grabbing bg-primary-600' : 'cursor-grab bg-light-500/50 dark:bg-dark-800/50'"
                @mousedown="startDrag">
                <span class="tracking-tighter">{{ title }}</span>

                <div class="flex gap-2">
                    <div class="flex gap-2">
                        <button v-for="action, i in actions" :key="i" @click="action.callback">
                            <component :is="action.icon" />
                        </button>
                    </div>

                    <button @click.stop="emit('close')" class="font-mono px-1 cursor-pointer">x</button>
                </div>
            </div>

            <div
                class="relative flex flex-1 min-h-0 max-h-full w-full flex-col border border-light-500 dark:border-dark-800 shadow-lg rounded-lg bg-light-400/30 dark:bg-dark-900/30 backdrop-blur-lg mt-1">
                <slot></slot>
            </div>
        </div>

        <div aria-hidden="true" class="absolute inset-x-2 top-0 z-20 h-1.5 cursor-ns-resize touch-none"
            @pointerdown="startResize($event, 'top')" />
        <div aria-hidden="true" class="absolute inset-y-2 right-0 z-20 w-1.5 cursor-ew-resize touch-none"
            @pointerdown="startResize($event, 'right')" />
        <div aria-hidden="true" class="absolute inset-x-2 bottom-0 z-20 h-1.5 cursor-ns-resize touch-none"
            @pointerdown="startResize($event, 'bottom')" />
        <div aria-hidden="true" class="absolute inset-y-2 left-0 z-20 w-1.5 cursor-ew-resize touch-none"
            @pointerdown="startResize($event, 'left')" />
    </div>
</template>
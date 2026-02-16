<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" @click.self="close">

        <!-- Backdrop -->
        <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" @click.self="close"></div>

        <!-- Modal Content -->
        <div class="relative z-10 bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-slide-up">
            <div class="text-center">
                <!-- Icon (Optional/Generic Warning) -->
                <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-600" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                <h3 class="text-lg font-bold text-gray-900 mb-2">{{ title }}</h3>
                <p class="text-sm text-gray-500 mb-6">{{ message }}</p>

                <button @click="close"
                    class="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    {{ buttonText }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: 'Attenzione'
    },
    message: {
        type: String,
        required: true
    },
    buttonText: {
        type: String,
        default: 'Chiudi'
    }
});

const emit = defineEmits(['close']);

const close = () => {
    emit('close');
};
</script>

<style scoped>
@keyframes slide-up {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-slide-up {
    animation: slide-up 0.2s ease-out forwards;
}
</style>
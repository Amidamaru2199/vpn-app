<template>
    <div class="home container">
        <ParticleImage />
        <HomeLinks />
    </div>
</template>

<script setup>
import ParticleImage from "../components/ParticleImage.vue";
import HomeLinks from "../components/HomeLinks.vue";
import { onMounted } from "vue";

onMounted(() => {
    const tg = window.Telegram?.WebApp;

    if (tg) {
        tg.BackButton.hide();
    }
});
</script>

<style scoped lang="scss">
.home {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100vh;
    background-image: url('/img/maps.png');
}
</style>

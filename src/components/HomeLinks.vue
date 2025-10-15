<template>
    <div class="home__links">
        <RouterLink class="router-link_main" text="Установить VPN" :to="'/configurations'">
            <template #icon>
                <AtomSVG />
            </template>
        </RouterLink>
        <RouterLink text="Продлить подписку (тарифы)" :to="'/tarifes'">
            <template #icon>
                <TarifesSVG />
            </template>
        </RouterLink>
        <RouterLink text="Управление серверами" :to="'/servers'">
            <template #icon>
                <EartSVG />
            </template>
        </RouterLink>
        <RouterLink text="Поддержка" :to="'/help'">
            <template #icon>
                <VoprosSVG />
            </template>
        </RouterLink>
    </div>
</template>

<script setup>
import RouterLink from "../components/ui/RouterLink.vue";
import VoprosSVG from "../components/icons/VoprosSVG.vue";
import AtomSVG from "../components/icons/AtomSVG.vue";
import TarifesSVG from "../components/icons/TarifesSVG.vue";
import EartSVG from "../components/icons/EartSVG.vue";
</script>

<style>
.home__links {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>
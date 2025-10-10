<template>
    <div class="home__links">
        <RouterLink class="router-link_main" text="Установка и настройка VPN" :to="'/configurations'">
            <template #icon>
                <AtomSVG />
            </template>
        </RouterLink>
        <RouterLink text="Видеоинструкция по установке" :to="'/about'">
            <template #icon>
                <InstructionSVG />
            </template>
        </RouterLink>
        <RouterLink text="Продлить подписку (тарифы)" :to="'/tarifes'">
            <template #icon>
                <TarifesSVG />
            </template>
        </RouterLink>
        <RouterLink text="Сменить страну (сервера)" :to="'/servers'">
            <template #icon>
                <EartSVG />
            </template>
        </RouterLink>
        <RouterLink text="Ответы на вопросы" :to="'/help'">
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
import InstructionSVG from "../components/icons/InstructionSVG.vue";
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
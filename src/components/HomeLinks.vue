<template>
    <div class="home__links">
        <RouterLink text="Установка и настройка VPN" :to="'/vpn-app/configurations'">
            <template #icon>
                <AtomSVG />
            </template>
        </RouterLink>
        <RouterLink text="Видеоинструкция по установке" :to="'/vpn-app/about'">
            <template #icon>
                <InstructionSVG />
            </template>
        </RouterLink>
        <RouterLink text="Продлить подписку (тарифы)" :to="'/vpn-app/tarifes'">
            <template #icon>
                <TarifesSVG />
            </template>
        </RouterLink>
        <RouterLink text="Сменить страну (сервера)" :to="'/vpn-app/servers'">
            <template #icon>
                <EartSVG />
            </template>
        </RouterLink>
        <RouterLink text="Ответы на вопросы" :to="'/vpn-app/help'">
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
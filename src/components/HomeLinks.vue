<template>
    <div class="home__links">
        <RouterLink v-if="!isSubscriptionExpired" class="router-link_main" text="Установить VPN" :to="'/configurations'">
            <template #icon>
                <AtomSVG />
            </template>
        </RouterLink>
        <RouterLink text="Продлить подписку (тарифы)" :to="'/tarifes'">
            <template #icon>
                <TarifesSVG />
            </template>
        </RouterLink>
        <RouterLink v-if="!isSubscriptionExpired" text="Управление серверами" :to="'/servers'">
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
import { defineProps } from "vue";

const props = defineProps({
    isSubscriptionExpired: {
        type: Boolean,
        default: false
    }
});
</script>

<style>
.home__links {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>
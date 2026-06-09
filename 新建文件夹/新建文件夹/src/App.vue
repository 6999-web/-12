<template>
  <div class="app-dashboard" @click="closeOnlineDropdown">
    <!-- Top high-tech sci-fi Header -->
    <Header v-model="activeTab" />

    <!-- Main Content Area based on Tab Selection -->
    <main class="main-content">
      <Transition name="fade" mode="out-in">
        <HomeOverview 
          v-if="activeTab === 'overview'" 
          @open-modal="openModal" 
          @toggle-online-users="toggleOnlineUsers"
        />
        <MembersHall
          v-else-if="activeTab === 'members'"
        />
        <AchievementsShowcase
          v-else-if="activeTab === 'achievements'"
        />
        <ProjectShowcase
          v-else-if="activeTab === 'projects'"
        />
        <ActivityShowcase
          v-else-if="activeTab === 'activities'"
        />
        <SpaceDevices 
          v-else-if="activeTab === 'devices'" 
          @open-modal="openModal"
        />
        <AIAssistant
          v-else-if="activeTab === 'ai-assistant'"
        />
      </Transition>
    </main>

    <!-- Unified interactive Modal & Dropdown overlay system -->
    <Modals 
      :active-modal="activeModal" 
      @close="closeModal" 
      @open-modal="openModal"
    />

    <FloatingAIAssistant v-if="activeTab === 'overview'" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Header from './components/Header.vue';
import HomeOverview from './components/HomeOverview.vue';
import SpaceDevices from './components/SpaceDevices.vue';
import Modals from './components/Modals.vue';
import MembersHall from './components/MembersHall.vue';
import AchievementsShowcase from './components/AchievementsShowcase.vue';
import ProjectShowcase from './components/ProjectShowcase.vue';
import ActivityShowcase from './components/ActivityShowcase.vue';
import AIAssistant from './components/AIAssistant.vue';
import FloatingAIAssistant from './components/FloatingAIAssistant.vue';

const activeTab = ref('overview');
const activeModal = ref('none');

const openModal = (modalName) => {
  activeModal.value = modalName;
};

const closeModal = () => {
  activeModal.value = 'none';
};

const toggleOnlineUsers = () => {
  if (activeModal.value === 'online-users') {
    activeModal.value = 'none';
  } else {
    activeModal.value = 'online-users';
  }
};

const closeOnlineDropdown = () => {
  if (activeModal.value === 'online-users') {
    activeModal.value = 'none';
  }
};
</script>

<style>
/* Global App Container */
.app-dashboard {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: var(--bg-dark);
  overflow: hidden;
  position: relative;
}

.main-content {
  flex-grow: 1;
  width: 100%;
  overflow: hidden;
}

/* Page transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

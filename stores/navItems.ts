// stores/navItems.ts
import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

interface NavItem {
  id: number;
  name: string;
  path: string;
  icon: string;
  children?: NavItem[];
}

// Initial default navigation items
const defaultNavItems: NavItem[] = [
  { id: 1, name: "Dashboard", icon: "mdi-view-dashboard", path: "/dashboard" },
  // Add other main menu items
  { id: 2, name: "Loket Admin", icon: "mdi-account-supervisor", path: "/LoketAdmin" },
  { id: 3, name: "Ranap Admin", icon: "mdi-bed", path: "/RanapAdmin" },
  { id: 4, name: "Klinik Admin", icon: "mdi-hospital-box", path: "/KlinikAdmin" },
  { id: 5, name: "Klinik Ruang Admin", icon: "mdi-hospital-marker", path: "/KlinikRuangAdmin" },
  {
    id: 6,
    name: "Anjungan",
    icon: "mdi-account-box-multiple",
    path: "",
    children: [
      { id: 7, name: "Anjungan", path: "/Anjungan/Anjungan", icon: "mdi-account-box" },
      { id: 8, name: "Admin Anjungan", path: "/Anjungan/AdminAnjungan", icon: "mdi-account-cog" },
    ],
  },
  { id: 9, name: "Fast Track", icon: "mdi-clock-fast", path: "/FastTrack" },
  { id: 10, name: "Data Pasien", icon: "mdi-account-multiple", path: "/DataPasien" },
  {
    id: 11,
    name: "Screen",
    icon: "mdi-monitor",
    path: "",
    children: [
      { id: 12, name: "Antrian Masuk 1", path: "/Screen/Antrian Masuk 1", icon: "mdi-monitor" },
      { id: 13, name: "Antrian Masuk 2", path: "/Screen/Antrian Masuk 2", icon: "mdi-monitor" },
      // ... more screen pages
    ],
  },
  { id: 14, name: "List Pasien", icon: "mdi-format-list-bulleted", path: "/ListPasien" },
   {
    id: 15 ,
    name: "Setting",
    icon: "mdi-cog",
    path: "",
    children: [
      { id: 16, name: "Hak Akses", path: "/setting/HakAkses", icon: "mdi-shield-lock-outline" },
      { id: 17, name: "User Login", path: "/setting/UserLogin", icon: "mdi-account-circle" },
      { id: 18, name: "Master Loket", path: "/setting/MasterLoket", icon: "mdi-counter" },
      { id: 19, name: "Master Klinik", path: "/setting/MasterKlinik", icon: "mdi-hospital" },
      { id: 20, name: "Master Klinik Ruang", path: "/setting/MasterKlinikRuang", icon: "mdi-hospital-box" },
      { id: 21, name: "Screen", path: "/setting/Screen", icon: "mdi-monitor" },
    ],
  },
];

export const useNavItemsStore = defineStore('navItems', () => {
  const navItems = useLocalStorage<NavItem[]>('navItems', defaultNavItems);

  function updateNavItems(newItems: NavItem[]) {
    // This will update the local storage and the state
    navItems.value = newItems.map((item, index) => ({
      ...item,
      id: index + 1
    }));
  }

  function addNavItem(newItem: Omit<NavItem, 'id'>) {
    const newId = navItems.value.length > 0 ? Math.max(...navItems.value.map(item => item.id)) + 1 : 1;
    navItems.value.push({ ...newItem, id: newId });
  }

  return {
    navItems,
    updateNavItems,
    addNavItem,
  };
});
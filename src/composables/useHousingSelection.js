import { ref } from "vue";

const selectedHousing = ref(null);

export function useHousingSelection() {
    function setSelectedHousing(housing) {
        selectedHousing.value = housing;
    }

    return {
        selectedHousing,
        setSelectedHousing,
    };
}

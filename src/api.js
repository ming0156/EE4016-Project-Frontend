import axios from 'axios';
import config from './config';

const base = config.api_base_url;

const MenuItem = {
    get_all: async () => axios.get(base + '/menuItem'),
};

const Gift = {
    // create_one: async (giftId, description, remarks, display_name_zh_hant, display_name_zh_hans, display_name_en, greenScore) =>
    //     axios.post(base + '/gift/', { giftId, description, remarks, display_name_zh_hant, display_name_zh_hans, display_name_en, greenScore }),

    create_one_gift: async (giftId, display_name_en, display_name_zh_hant, display_name_zh_hans, locationId, shop_name, type, display) =>
        axios.post(base + '/gift/', { giftId, display_name_en, display_name_zh_hant, display_name_zh_hans, locationId, shop_name, type, display }),

    create_one_coupon: async (giftId, display_name_en, display_name_zh_hant, display_name_zh_hans, coupon_code, unit_rate, redemption_start_date) =>
        axios.post(base + '/gift/', { giftId, display_name_en, display_name_zh_hant, display_name_zh_hans, coupon_code, unit_rate, redemption_start_date }),

    get_all: async (params, cancelToken) => axios.get(base + '/gift', { params, cancelToken }),

    get_one: async (giftId) => axios.get(base + '/gift/' + giftId),

    update_one_gift: async (giftId, display_name_en, display_name_zh_hant, display_name_zh_hans, locationId, shop_name, type, display) =>
        axios.put(base + '/gift/', { giftId, display_name_en, display_name_zh_hant, display_name_zh_hans, locationId, shop_name, type, display }),

    update_one_coupon: async (giftId, display_name_en, display_name_zh_hant, display_name_zh_hans, coupon_code, unit_rate, redemption_start_date) =>
        axios.put(base + '/gift/', { giftId, display_name_en, display_name_zh_hant, display_name_zh_hans, coupon_code, unit_rate, redemption_start_date }),

    delete_one: async (giftId) => axios.delete(base + '/gift/' + giftId),

    export_csv: async (params) => axios.get(base + '/gift/csv', { params, responseType: 'blob' }),

    import_csv_gift: async (file) => {
        let formData = new FormData();
        formData.append('file', file);
        return axios.post(base + '/gift/giftcsv', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    },

    import_csv_coupon: async (file) => {
        let formData = new FormData();
        formData.append('file', file);
        return axios.post(base + '/gift/couponcsv', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    },
};

const Home = {
    import_music_mp3: async (file) => {
        let formData = new FormData();
        formData.append('file', file, 'audio.mp3');
        return axios.post(
            base + '/home/importmp3',
            formData,
            {
                headers: {
                    Accept: 'audio/mpeg',
                    'Content-Type': 'audio/mpeg'
                }
            }
        );
    },

};

export default {
    MenuItem,
    Gift,
    Home,
};

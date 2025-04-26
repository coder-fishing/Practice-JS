// Format utilities for product data
export const formatters = {
    // Format tên sản phẩm
    formatName: (name) => {
        if (!name) return 'undefined';
        return name.length > 30 ? name.substring(0, 30) + '...' : name;
    },

    // Format SKU
    formatSKU: (sku) => {
        if (!sku) return 'undefined';
        return sku.length > 10 ? sku.substring(0, 10) + '...' : sku;
    },

    // Format giá
    formatPrice: (price) => {
        if (!price || isNaN(price)) return 'undefined';
        return new Intl.NumberFormat('vi-VN', {
            // style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
        }).format(price);
    },

    // Format số lượng
    formatStock: (stock) => {
        if (!stock || isNaN(stock)) return 'undefined';
        return new Intl.NumberFormat('vi-VN').format(stock);
    },

    // Format ngày
    formatDate: (dateString) => {
        if (!dateString) return 'undefined';
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);

}; 


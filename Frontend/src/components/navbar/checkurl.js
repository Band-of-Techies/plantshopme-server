export const getTitle = (prop) => {
    switch (prop) {
        case 'addCategory':
            return 'Add Category';
        case 'addAddProduct':
            return 'Add Product';
        case 'addPot':
            return 'Add Pot';
        case 'all-products':
            return 'All Products';
        case 'productstock':
            return 'Product Stock';
        case 'orderdetails':
            return 'Order Details';
        case 'FlashSale':
            return 'Flash Sale';
        case 'updateProduct':
            return 'Update Product';
        case 'addBlog':
            return 'Add Blog';
        case 'blogs':
            return 'Blogs';
        case 'offerBanners':
            return 'Offer Banners';
        case 'addplantcare':
            return 'Add Plantcare';
        case 'locations':
            return 'Locations';
        case 'Addcoupons':
            return 'Coupons';
        case 'otherproducts':
            return 'Other Products';
        case 'newsletter':
            return 'News Letter';
        default:
            return 'Dashboard';
    }
}

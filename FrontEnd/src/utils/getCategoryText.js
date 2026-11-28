const CategoryText ={
    ELECTRICAL:"ไฟฟ้า",
    PLUMBING:"ประปา",
    AIR_CONDITIONER:"แอร์",
    PAINTING:"ทาสี",
    CONSTRUCTION:"ก่อสร้าง",
    FURNITURE:"เฟอร์นิเจอร์",
    CLEANING:"ทำความสะอาด",
    OTHER:"อื่นๆ"
}

export function getCategory (Category){
    return CategoryText[Category] || Category;
}
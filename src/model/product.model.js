export class Product {
  constructor(
    id,
    name,
    sku,
    category,
    price,
    status,
    added,
    description,
    photo,
    discountType,
    discountValue,
    taxClass,
    vatAmount,
    barcode,
    quantity
  ) {
    this.id = id;
    this.name = name;
    this.sku = sku;
    this.category = category;
    this.price = price;
    this.status = status;
    this.added = added;
    this.description = description;
    this.photo = photo;
    this.discountType = discountType;
    this.discountValue = discountValue;
    this.taxClass = taxClass;
    this.vatAmount = vatAmount;
    this.barcode = barcode;
    this.quantity = quantity;
  }
}

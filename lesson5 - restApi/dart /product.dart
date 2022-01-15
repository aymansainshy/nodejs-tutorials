class Product {
  late String id;
  late String title;
  late String storeId;
  late String type; // Clothes - Shose
  late List<String> supCategories; // [1, 2 ,3]
  late Specification specification;
  late String description;
  late int soldQuantity;
  late double rate; //
  late bool isActive;
  late double decount; //10% - 0.10
  late List<String> pictures;
  late List<String> targets;
  late bool isFavorited;

  // late bool hasArgumentRealty;

  Product({
    required this.id,
    required this.title,
    required this.storeId,
    required this.type,
    required this.supCategories,
    required this.description,
    required this.pictures,
    required this.targets,
    required this.specification,
  });
}

class GenaralSpecification extends Specification {
  late String brand;
  late List<Colors> colors;

  GenaralSpecification({
    required this.brand,
    required this.colors,
  });
}

class WatchSpecification extends Specification {
  late String brand;
  late bool automatic;
  late bool waterResistance;
  late List<WatchAndGlasseColor> colors;

  WatchSpecification({
    required this.brand,
    required this.automatic,
    required this.waterResistance,
    required this.colors,
  });
}

class WatchAndGlasseColor {
  late String color;
  late int stock;

  WatchAndGlasseColor({
    required this.color,
    required this.stock,
  });
}

class Colors {
  late String color;
  late List<Size> sizes;

  Colors({
    required this.color,
    required this.sizes,
  });
}

class Size {
  late String size;
  late int stock;

  Size({
    required this.size,
    required this.stock,
  });
}

abstract class Specification {}

final Product watchProduct = Product(
  id: "1",
  title: "Watch",
  storeId: "1",
  type: "Accessories",
  supCategories: ['6'],
  description: 'Nice Watch',
  pictures: ["image1", "image2", "image3"],
  targets: ["man", "woman"],
  specification: WatchSpecification(
    brand: 'China',
    automatic: true,
    waterResistance: true,
    colors: [
      WatchAndGlasseColor(
        color: "#0090d",
        stock: 20,
      ),
    ],
  ),
);


final Product athorProduct = Product(
  id: "1",
  title: "Watch",
  storeId: "1",
  type: "Accessories",
  supCategories: ['6'],
  description: 'Nice Watch',
  pictures: ["image1", "image2", "image3"],
  targets: ["man", "woman"],
  specification: GenaralSpecification(
    brand: 'Japan',
    colors: [
      Colors(
        color: "#0000",
        sizes: [
          Size(size: "M", stock: 12),
          Size(size: "XXL", stock: 5),
        ],
      ),
    ],
  ),
);

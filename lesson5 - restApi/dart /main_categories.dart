class MainCategory {
  late String id;
  late String title;
  late List<SupCategory> supCategories;
  // [ Clothes - Shose - Accessories - Bags]
}

class SupCategory {
  late String id;
  late String title;
  late String mainCatId;
  late List<String> sizes;
  // [Shirts - Hoodes - Pants - Shose - Bags - Glasses - Watch]
}



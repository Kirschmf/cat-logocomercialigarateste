import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingCart, 
  Heart, 
  Compare, 
  Filter, 
  Search, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

// Advanced Product Data Structure
const initialProducts = [
  {
    id: 1,
    name: 'Smartphone Pro Max',
    category: 'Eletrônicos',
    brand: 'TechMaster',
    price: 2999.99,
    originalPrice: 3499.99,
    rating: 4.7,
    image: '/api/placeholder/300/400',
    features: ['5G', 'Câmera Quádrupla', 'Bateria 5000mAh']
  },
  // ... (additional products with similar structure)
].concat(Array.from({ length: 30 }, (_, i) => ({
  id: i + 21,
  name: `Produto Genérico ${i + 1}`,
  category: ['Eletrônicos', 'Moda', 'Casa'][i % 3],
  brand: ['TechMaster', 'FashionTrend', 'HomeStyle'][i % 3],
  price: Math.floor(Math.random() * 5000) + 50,
  originalPrice: Math.floor(Math.random() * 5000) + 50,
  rating: Math.floor(Math.random() * 50) / 10,
  image: '/api/placeholder/300/400',
  features: ['Característica A', 'Característica B', 'Característica C']
})));

const AdvancedProductCatalog = () => {
  const [products, setProducts] = useState(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 5000],
    brand: '',
    minRating: 0
  });
  const [sortOption, setSortOption] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [gridColumns, setGridColumns] = useState(5);
  const searchInputRef = useRef(null);

  // Advanced Filtering and Sorting Logic
  useEffect(() => {
    let result = products.filter(product => {
      const matchCategory = !filters.category || product.category === filters.category;
      const matchPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      const matchBrand = !filters.brand || product.brand === filters.brand;
      const matchRating = product.rating >= filters.minRating;
      const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());

      return matchCategory && matchPrice && matchBrand && matchRating && matchSearch;
    });

    // Sorting
    switch(sortOption) {
      case 'priceAsc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    setFilteredProducts(result);
  }, [filters, sortOption, searchTerm]);

  const addToCart = (product) => {
    setCart(prev => [...prev, product]);
  };

  const toggleFavorite = (product) => {
    setFavorites(prev => 
      prev.some(p => p.id === product.id)
        ? prev.filter(p => p.id !== product.id)
        : [...prev, product]
    );
  };

  const toggleCompare = (product) => {
    setCompareList(prev => 
      prev.some(p => p.id === product.id)
        ? prev.filter(p => p.id !== product.id)
        : [...prev, product]
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Advanced Header with Search and Filters */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img src="/api/placeholder/50/50" alt="Logo" className="rounded-full" />
            <h1 className="text-2xl font-bold">Catálogo Avançado</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative flex-grow">
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Buscar produtos..." 
                className="w-full p-2 rounded text-black"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-3 text-gray-500" />
            </div>
            
            <div className="flex space-x-4">
              <button className="relative hover:text-pink-300">
                <Heart />
                {favorites.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 text-xs">
                    {favorites.length}
                  </span>
                )}
              </button>
              <button className="relative hover:text-blue-300">
                <ShoppingCart />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full px-2 text-xs">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Filters and Sorting */}
      <div className="container mx-auto mt-4 bg-white p-4 rounded shadow">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <select 
              className="p-2 border rounded"
              value={filters.category}
              onChange={(e) => setFilters(prev => ({...prev, category: e.target.value}))}
            >
              <option value="">Todas Categorias</option>
              <option>Eletrônicos</option>
              <option>Moda</option>
              <option>Casa</option>
            </select>

            <select 
              className="p-2 border rounded"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="">Ordenar por</option>
              <option value="priceAsc">Preço: Menor para Maior</option>
              <option value="priceDesc">Preço: Maior para Menor</option>
              <option value="rating">Melhores Avaliados</option>
            </select>

            <button 
              className="flex items-center p-2 border rounded hover:bg-gray-100"
              onClick={() => setGridColumns(prev => prev === 3 ? 5 : 3)}
            >
              {gridColumns === 5 ? 'Visualização Compacta' : 'Visualização Expandida'}
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <span>Produtos: {filteredProducts.length}</span>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className={`container mx-auto mt-4 grid grid-cols-${gridColumns} gap-4 p-4`}>
        {filteredProducts.map(product => (
          <div 
            key={product.id} 
            className="bg-white border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
          >
            <div className="relative">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                <button 
                  onClick={() => toggleFavorite(product)}
                  className={`p-1 rounded-full ${
                    favorites.some(p => p.id === product.id) 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white text-gray-500'
                  }`}
                >
                  <Heart size={20} />
                </button>
                <button 
                  onClick={() => toggleCompare(product)}
                  className={`p-1 rounded-full ${
                    compareList.some(p => p.id === product.id) 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-500'
                  }`}
                >
                  <Compare size={20} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{product.name}</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-green-600 font-bold text-xl">
                  R$ {product.price.toFixed(2)}
                </span>
                <span className="line-through text-gray-400">
                  R$ {product.originalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center mb-2">
                <span className="text-yellow-500 mr-2">★</span>
                <span>{product.rating.toFixed(1)}</span>
              </div>
              <div className="mb-2">
                {product.features.slice(0, 2).map((feature, index) => (
                  <span key={index} className="bg-gray-100 px-2 py-1 rounded mr-2 text-xs">
                    {feature}
                  </span>
                ))}
              </div>
              <button 
                onClick={() => addToCart(product)}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdvancedProductCatalog;

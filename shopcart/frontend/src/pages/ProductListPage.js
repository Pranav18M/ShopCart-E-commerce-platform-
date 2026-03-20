import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX } from 'react-icons/fi';
import {
  fetchProducts, fetchCategories, setFilters, clearFilters,
  selectProducts, selectCategories, selectProductFilters,
  selectProductPagination, selectProductsLoading
} from '../store/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './ProductListPage.css';

const SORT_OPTIONS = [
  { value: 'createdAt,desc', label: 'Newest First' },
  { value: 'price,asc', label: 'Price: Low to High' },
  { value: 'price,desc', label: 'Price: High to Low' },
  { value: 'rating,desc', label: 'Top Rated' },
  { value: 'name,asc', label: 'Name: A-Z' },
];

const ProductListPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);
  const filters = useSelector(selectProductFilters);
  const pagination = useSelector(selectProductPagination);
  const loading = useSelector(selectProductsLoading);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [page, setPage] = useState(0);

  // ── Sync URL params to filters whenever URL changes ──
  useEffect(() => {
    dispatch(fetchCategories());

    const searchVal = searchParams.get('search') || '';
    const categoryVal = searchParams.get('category') || '';

    // Always reset filters from URL — clears stale state
    dispatch(setFilters({
      search: searchVal,
      category: categoryVal,
      minPrice: '',
      maxPrice: '',
      sort: 'createdAt,desc',
    }));
    setPage(0);
  }, [searchParams.get('search'), searchParams.get('category')]);

  // ── Fetch products when filters or page change ──
  useEffect(() => {
    const params = { page, size: 20, sort: filters.sort };
    if (filters.search) params.search = filters.search;
    if (filters.category) params.category = filters.category;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    dispatch(fetchProducts(params));
  }, [filters, page, dispatch]);

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
    setPage(0);
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setPage(0);
    setSearchParams({});
  };

  const activeFiltersCount = [
    filters.category, filters.minPrice, filters.maxPrice, filters.search
  ].filter(Boolean).length;

  const FilterSidebar = () => (
    <div className="filter-sidebar">
      <div className="filter-header">
        <h3>Filters</h3>
        {activeFiltersCount > 0 && (
          <button className="clear-filters-btn" onClick={handleClearFilters}>
            Clear All ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="filter-section">
        <h4>Category</h4>
        <div className="filter-options">
          <label className="filter-option">
            <input type="radio" name="category" checked={!filters.category}
              onChange={() => handleFilterChange('category', '')} />
            <span>All Categories</span>
          </label>
          {categories.map(cat => (
            <label key={cat.id} className="filter-option">
              <input type="radio" name="category"
                checked={filters.category === cat.name}
                onChange={() => handleFilterChange('category', cat.name)} />
              <span>{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="filter-section">
        <h4>Price Range</h4>
        <div className="price-inputs">
          <input type="number" placeholder="Min ₹" value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            className="form-input" min="0" />
          <span>—</span>
          <input type="number" placeholder="Max ₹" value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            className="form-input" min="0" />
        </div>
        <div className="price-presets">
          {[
            ['Under ₹500', '', '500'],
            ['₹500-₹2000', '500', '2000'],
            ['₹2000-₹10000', '2000', '10000'],
            ['Above ₹10000', '10000', '']
          ].map(([label, min, max]) => (
            <button key={label}
              className={`price-preset ${filters.minPrice === min && filters.maxPrice === max ? 'active' : ''}`}
              onClick={() => {
                handleFilterChange('minPrice', min);
                handleFilterChange('maxPrice', max);
              }}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="product-list-page">
      <div className="container">
        {/* Header */}
        <div className="list-page-header">
          <div className="list-title">
            {filters.search
              ? <><h1>Results for "<em>{filters.search}</em>"</h1>
                  <span>{pagination.totalElements} products found</span></>
              : <><h1>{filters.category || 'All Products'}</h1>
                  <span>{pagination.totalElements} products</span></>
            }
          </div>
          <div className="list-controls">
            <button className="mobile-filter-btn" onClick={() => setShowMobileFilter(true)}>
              <FiFilter /> Filters
              {activeFiltersCount > 0 && (
                <span className="filter-count">{activeFiltersCount}</span>
              )}
            </button>
            <div className="sort-select-wrap">
              <select value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="sort-select">
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="list-layout">
          {/* Desktop Sidebar */}
          <aside className="sidebar-desktop"><FilterSidebar /></aside>

          {/* Mobile Filter Drawer */}
          {showMobileFilter && (
            <div className="mobile-filter-overlay" onClick={() => setShowMobileFilter(false)}>
              <div className="mobile-filter-drawer" onClick={(e) => e.stopPropagation()}>
                <div className="mobile-filter-close">
                  <h3>Filters</h3>
                  <button onClick={() => setShowMobileFilter(false)}>
                    <FiX size={20} />
                  </button>
                </div>
                <FilterSidebar />
                <button className="btn btn-primary btn-full"
                  onClick={() => setShowMobileFilter(false)}>
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          {/* Products */}
          <main className="products-main">
            {loading ? (
              <LoadingSpinner />
            ) : products.length === 0 ? (
              <div className="empty-state">
                <span style={{ fontSize: 64 }}>🔍</span>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button className="btn btn-outline" onClick={handleClearFilters}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="products-grid-list">
                  {products.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
                {pagination.totalPages > 1 && (
                  <div className="pagination">
                    <button className="page-btn" disabled={page === 0}
                      onClick={() => setPage(p => p - 1)}>‹</button>
                    {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => (
                      <button key={i}
                        className={`page-btn ${page === i ? 'active' : ''}`}
                        onClick={() => setPage(i)}>{i + 1}</button>
                    ))}
                    <button className="page-btn"
                      disabled={page >= pagination.totalPages - 1}
                      onClick={() => setPage(p => p + 1)}>›</button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
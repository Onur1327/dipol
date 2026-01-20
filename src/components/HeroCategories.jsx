import { Link } from 'react-router-dom';

const HeroCategories = () => {
  const categories = [
    {
      name: 'Üst Giyim',
      link: '/products?category=ust-giyim',
      image: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1600&auto=format&fit=crop'
    },
    {
      name: 'Alt Giyim',
      link: '/products?category=alt-giyim',
      image: 'https://images.unsplash.com/photo-1551854838-212c50b4c184?q=80&w=1600&auto=format&fit=crop'
    },
    {
      name: 'Dış Giyim',
      link: '/products?category=dis-giyim',
      image: 'https://images.unsplash.com/photo-1512412046876-c91b4c1b0f6d?q=80&w=1600&auto=format&fit=crop'
    }
  ];

  return (
    <section className="hero-categories">
      <div className="container">
        <div className="hero-cat-grid">
          {categories.map((cat, index) => (
            <Link
              key={index}
              className="hero-cat"
              to={cat.link}
              style={{ backgroundImage: `url('${cat.image}')` }}
            >
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroCategories;


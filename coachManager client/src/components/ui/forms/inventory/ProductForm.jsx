import { useState } from 'react';

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>Ajouter / Modifier un Produit</h2>

      <div>
        <label htmlFor="name">Nom du produit</label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="quantity">Quantité</label>
        <input
          id="quantity"
          type="number"
          name="quantity"
          min="0"
          value={formData.quantity}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit">Enregistrer</button>
    </form>
  );
};

export default ProductForm;

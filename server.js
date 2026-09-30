const express = require("express");

const app = express();
const PORT = 3000;

let produits = require("./produits");

// Permet à Express de recevoir du JSON
app.use(express.json());

/*
  1. LISTER les produits
  GET /produits
*/
app.get("/produits", (req, res) => {
  res.status(200).json(produits);
});

/*
  2. CONSULTER un produit
  GET /produits/:id
*/
app.get("/produits/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const produit = produits.find(p => p.id === id);

  if (!produit) {
    return res.status(404).json({
      message: "Produit non trouvé"
    });
  }

  res.status(200).json(produit);
});

/*
  3. AJOUTER un produit
  POST /produits
*/
app.post("/produits", (req, res) => {
  const { nom, description, prix, categorie } = req.body;

  if (!nom || !description || prix === undefined || !categorie) {
    return res.status(400).json({
      message: "Tous les champs sont obligatoires"
    });
  }

  const nouveauProduit = {
    id: produits.length > 0
      ? Math.max(...produits.map(p => p.id)) + 1
      : 1,
    nom,
    description,
    prix,
    categorie
  };

  produits.push(nouveauProduit);

  res.status(201).json(nouveauProduit);
});

/*
  4. MODIFIER partiellement un produit
  PATCH /produits/:id
*/
app.patch("/produits/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const produit = produits.find(p => p.id === id);

  if (!produit) {
    return res.status(404).json({
      message: "Produit non trouvé"
    });
  }

  const { nom, description, prix, categorie } = req.body;

  if (nom !== undefined) produit.nom = nom;
  if (description !== undefined) produit.description = description;
  if (prix !== undefined) produit.prix = prix;
  if (categorie !== undefined) produit.categorie = categorie;

  res.status(200).json(produit);
});

/*
  5. REMPLACER complètement un produit
  PUT /produits/:id
*/
app.put("/produits/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const index = produits.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Produit non trouvé"
    });
  }

  const { nom, description, prix, categorie } = req.body;

  if (!nom || !description || prix === undefined || !categorie) {
    return res.status(400).json({
      message: "Tous les champs sont obligatoires"
    });
  }

  const produitModifie = {
    id,
    nom,
    description,
    prix,
    categorie
  };

  produits[index] = produitModifie;

  res.status(200).json(produitModifie);
});

/*
  6. SUPPRIMER un produit
  DELETE /produits/:id
*/
app.delete("/produits/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const index = produits.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Produit non trouvé"
    });
  }

  produits.splice(index, 1);

  res.status(204).send();
});

// Route inconnue
app.use((req, res) => {
  res.status(404).json({
    message: "Route non trouvée"
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`API démarrée sur http://localhost:${PORT}`);
});

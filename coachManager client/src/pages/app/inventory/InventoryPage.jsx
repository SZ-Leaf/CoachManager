import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';

import Alert from '../../../components/ui/feedback/Alert.jsx';
import EmptyState from '../../../components/ui/feedback/EmptyState.jsx';
import Spinner from '../../../components/ui/feedback/Spinner.jsx';
import * as inventoryApi from '../../../services/inventoryService.js';
import * as listApi from '../../../services/listService.js';
import * as productApi from '../../../services/productService.js';
import * as teamApi from '../../../services/teamService.js';
import AppPage from '../AppPage.jsx';
import './InventoryPage.css';

export default function InventoryPage() {
  const qc = useQueryClient();
  const [newInvTeamId, setNewInvTeamId] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [expandedListId, setExpandedListId] = useState('');
  const [listName, setListName] = useState('');
  const [productName, setProductName] = useState('');
  const [productQty, setProductQty] = useState('1');
  const [msg, setMsg] = useState('');
  /** @type {number | null} */
  const [editingListId, setEditingListId] = useState(null);
  const [renameDraft, setRenameDraft] = useState('');

  const teamsQuery = useQuery({
    queryKey: ['teams'],
    queryFn: teamApi.fetchTeams,
  });

  const invQuery = useQuery({
    queryKey: ['inventories'],
    queryFn: inventoryApi.fetchInventories,
  });

  const listsQuery = useQuery({
    queryKey: ['lists'],
    queryFn: listApi.fetchLists,
  });

  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: productApi.fetchProducts,
  });

  const teams = teamsQuery.data?.items ?? [];
  const inventories = invQuery.data?.items ?? [];
  const lists = listsQuery.data?.items ?? [];
  const products = productsQuery.data?.items ?? [];

  const inventoryByTeamId = useMemo(() => {
    /** @type {Record<string, number>} */
    const m = {};
    for (const inv of inventories) {
      const tid = inv.teamId;
      if (tid != null) {
        m[String(tid)] = inv.id;
      }
    }
    return m;
  }, [inventories]);

  const invId = inventoryByTeamId[selectedTeamId] ?? '';

  const listsForInv = useMemo(
    () => lists.filter((l) => l.inventoryId === Number(invId)),
    [lists, invId],
  );

  const productsForListId = (listId) =>
    products.filter((p) => p.itemListId === listId);

  useEffect(() => {
    setProductName('');
    setProductQty('1');
  }, [expandedListId]);

  const createInv = useMutation({
    mutationFn: () =>
      inventoryApi.createInventory({ teamId: Number(newInvTeamId) }),
    onSuccess: async (data) => {
      setNewInvTeamId('');
      const tid = data?.item?.teamId;
      if (tid != null) {
        setSelectedTeamId(String(tid));
        setExpandedListId('');
        setEditingListId(null);
      }
      await qc.refetchQueries({ queryKey: ['inventories'] });
      setMsg('Inventaire créé');
    },
    onError: (e) => setMsg(e.message),
  });

  const createList = useMutation({
    mutationFn: () =>
      listApi.createList({
        name: listName.trim(),
        inventoryId: Number(invId),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lists'] });
      setListName('');
      setMsg('Liste créée');
    },
    onError: (e) => setMsg(e.message),
  });

  const updateListName = useMutation({
    mutationFn: ({ id, name }) =>
      listApi.updateList(id, { name: name.trim() }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lists'] });
      setEditingListId(null);
      setMsg('Liste mise à jour');
    },
    onError: (e) => setMsg(e.message),
  });

  const createProduct = useMutation({
    mutationFn: ({ listId, name, quantity }) =>
      productApi.createProduct({
        name: name.trim(),
        quantity: Number(quantity) || 0,
        itemListId: listId,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      setProductName('');
      setProductQty('1');
      setMsg('Produit ajouté');
    },
    onError: (e) => setMsg(e.message),
  });

  const deleteProduct = useMutation({
    mutationFn: (id) => productApi.deleteProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });

  const deleteList = useMutation({
    mutationFn: (id) => listApi.deleteList(id),
    onSuccess: (_, deletedId) => {
      qc.invalidateQueries({ queryKey: ['lists'] });
      if (String(deletedId) === expandedListId) {
        setExpandedListId('');
      }
      if (deletedId === editingListId) {
        setEditingListId(null);
      }
    },
  });

  const loading =
    teamsQuery.isLoading ||
    invQuery.isLoading ||
    listsQuery.isLoading ||
    productsQuery.isLoading;

  const beginRename = (l) => {
    setExpandedListId(String(l.id));
    setEditingListId(l.id);
    setRenameDraft(l.name);
  };

  const cancelRename = () => {
    setEditingListId(null);
  };

  const commitRename = () => {
    if (editingListId == null) return;
    const trimmed = renameDraft.trim();
    if (!trimmed) return;
    const original = listsForInv.find((x) => x.id === editingListId)?.name;
    if (trimmed === original) {
      setEditingListId(null);
      return;
    }
    updateListName.mutate({ id: editingListId, name: trimmed });
  };

  const toggleListExpanded = (id) => {
    const idStr = String(id);
    setExpandedListId((prev) => (prev === idStr ? '' : idStr));
  };

  return (
    <AppPage
      title="Inventaire"
      description="Un inventaire par équipe, listes et produits."
    >
      <div className="crud-page">
        {loading ? <Spinner /> : null}
        {teamsQuery.error || invQuery.error ? (
          <Alert variant="error">Impossible de charger les données.</Alert>
        ) : null}

        {msg ? (
          <Alert variant="info" onDismiss={() => setMsg('')}>
            {msg}
          </Alert>
        ) : null}

        <section className="inventory-section">
          <h2>Équipe</h2>
          <p className="inventory-section__lead">
            Choisis une équipe pour afficher son inventaire et ses listes.
          </p>
          {inventories.length === 0 ? (
            <EmptyState title="Aucun inventaire" />
          ) : (
            <select
              value={selectedTeamId}
              onChange={(e) => {
                setSelectedTeamId(e.target.value);
                setExpandedListId('');
                setEditingListId(null);
              }}
            >
              <option value="">Sélectionner une équipe…</option>
              {teams.map((t) => {
                const hasInv = inventoryByTeamId[String(t.id)] != null;
                return (
                  <option
                    key={t.id}
                    value={t.id}
                    disabled={!hasInv}
                  >
                    {hasInv ? t.name : `${t.name} (pas d’inventaire)`}
                  </option>
                );
              })}
            </select>
          )}
        </section>

        {invId ? (
          <section className="inventory-section">
            <h2>Listes</h2>
            <div className="crud-toolbar">
              <input
                placeholder="Nom de la liste"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-primary"
                disabled={!listName.trim() || createList.isPending}
                onClick={() => createList.mutate()}
              >
                Ajouter liste
              </button>
            </div>
            {listsForInv.length === 0 ? (
              <EmptyState title="Aucune liste dans cet inventaire" />
            ) : (
              <ul className="inventory-accordion">
                {listsForInv.map((l) => {
                  const isOpen = expandedListId === String(l.id);
                  const listProducts = productsForListId(l.id);

                  return (
                    <li key={l.id} className="inventory-accordion__item">
                      {editingListId === l.id ? (
                        <div className="inventory-accordion__row">
                          <input
                            className="inventory-pill-list__rename-input"
                            value={renameDraft}
                            onChange={(e) => setRenameDraft(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                commitRename();
                              }
                              if (e.key === 'Escape') {
                                e.preventDefault();
                                cancelRename();
                              }
                            }}
                            autoFocus
                            aria-label="Nom de la liste"
                          />
                          <button
                            type="button"
                            className="btn btn-primary inventory-pill-list__action"
                            title="Enregistrer"
                            aria-label="Enregistrer"
                            disabled={
                              !renameDraft.trim() ||
                              renameDraft.trim() === l.name ||
                              updateListName.isPending
                            }
                            onClick={() => commitRename()}
                          >
                            ✓
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary inventory-pill-list__action"
                            title="Annuler"
                            aria-label="Annuler"
                            disabled={updateListName.isPending}
                            onClick={() => cancelRename()}
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="inventory-accordion__row">
                            <button
                              type="button"
                              className={`btn btn-secondary inventory-accordion__trigger ${isOpen ? 'is-open' : ''}`}
                              id={`inventory-list-trigger-${l.id}`}
                              aria-expanded={isOpen}
                              aria-controls={`inventory-list-panel-${l.id}`}
                              onClick={() => toggleListExpanded(l.id)}
                            >
                              <span
                                className="inventory-accordion__chevron"
                                aria-hidden
                              >
                                {isOpen ? '▼' : '▶'}
                              </span>
                              <span className="inventory-accordion__title">
                                {l.name}
                              </span>
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary inventory-pill-list__action"
                              title="Renommer"
                              aria-label="Renommer"
                              onClick={(e) => {
                                e.stopPropagation();
                                beginRename(l);
                              }}
                            >
                              ✎
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger inventory-pill-list__action"
                              title="Supprimer"
                              aria-label="Supprimer"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm('Supprimer cette liste ?')) {
                                  deleteList.mutate(l.id);
                                }
                              }}
                            >
                              ×
                            </button>
                          </div>
                          {isOpen ? (
                            <div
                              className="inventory-accordion__panel"
                              id={`inventory-list-panel-${l.id}`}
                              role="region"
                              aria-labelledby={`inventory-list-trigger-${l.id}`}
                              aria-label={`Produits — ${l.name}`}
                            >
                              <div className="crud-toolbar inventory-accordion__product-toolbar">
                                <input
                                  placeholder="Nom du produit"
                                  value={productName}
                                  onChange={(e) =>
                                    setProductName(e.target.value)
                                  }
                                />
                                <input
                                  type="number"
                                  min={0}
                                  className="inventory-qty-input"
                                  value={productQty}
                                  onChange={(e) =>
                                    setProductQty(e.target.value)
                                  }
                                />
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  disabled={
                                    !productName.trim() ||
                                    createProduct.isPending
                                  }
                                  onClick={() =>
                                    createProduct.mutate({
                                      listId: l.id,
                                      name: productName,
                                      quantity: productQty,
                                    })
                                  }
                                >
                                  Ajouter
                                </button>
                              </div>
                              {listProducts.length === 0 ? (
                                <p className="inventory-accordion__empty">
                                  Aucun produit dans cette liste.
                                </p>
                              ) : (
                                <div className="crud-table-wrap">
                                  <table className="crud-table">
                                    <thead>
                                      <tr>
                                        <th>Nom</th>
                                        <th>Qté</th>
                                        <th />
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {listProducts.map((p) => (
                                        <tr key={p.id}>
                                          <td data-label="Nom">{p.name}</td>
                                          <td data-label="Qté">
                                            {p.quantity}
                                          </td>
                                          <td
                                            data-label="Actions"
                                            className="crud-table__actions"
                                          >
                                            <button
                                              type="button"
                                              className="btn btn-danger btn-compact"
                                              onClick={() => {
                                                if (
                                                  window.confirm(
                                                    'Supprimer ce produit ?',
                                                  )
                                                ) {
                                                  deleteProduct.mutate(p.id);
                                                }
                                              }}
                                            >
                                              Supprimer
                                            </button>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          ) : null}
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        ) : null}

        <section className="inventory-section inventory-section--aside">
          <h2>Créer un inventaire</h2>
          <p className="inventory-section__lead">
            Réservé aux équipes qui n’ont pas encore d’inventaire.
          </p>
          <div className="crud-toolbar">
            <select
              value={newInvTeamId}
              onChange={(e) => setNewInvTeamId(e.target.value)}
            >
              <option value="">Équipe…</option>
              {teams.map((t) => {
                const taken = inventoryByTeamId[String(t.id)] != null;
                return (
                  <option key={t.id} value={t.id} disabled={taken}>
                    {taken ? `${t.name} (déjà un inventaire)` : t.name}
                  </option>
                );
              })}
            </select>
            <button
              type="button"
              className="btn btn-primary"
              disabled={!newInvTeamId || createInv.isPending}
              onClick={() => createInv.mutate()}
            >
              Créer inventaire
            </button>
          </div>
        </section>
      </div>
    </AppPage>
  );
}

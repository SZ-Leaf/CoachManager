import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

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
  const [teamId, setTeamId] = useState('');
  const [invId, setInvId] = useState('');
  const [listId, setListId] = useState('');
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

  const inventories = invQuery.data?.items ?? [];
  const lists = listsQuery.data?.items ?? [];
  const products = productsQuery.data?.items ?? [];

  const listsForInv = useMemo(
    () => lists.filter((l) => l.inventoryId === Number(invId)),
    [lists, invId],
  );

  const productsForList = useMemo(
    () => products.filter((p) => p.itemListId === Number(listId)),
    [products, listId],
  );

  const createInv = useMutation({
    mutationFn: () =>
      inventoryApi.createInventory({ teamId: Number(teamId) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['inventories'] });
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
    mutationFn: () =>
      productApi.createProduct({
        name: productName.trim(),
        quantity: Number(productQty) || 0,
        itemListId: Number(listId),
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
      if (String(deletedId) === listId) {
        setListId('');
      }
      if (deletedId === editingListId) {
        setEditingListId(null);
      }
    },
  });

  const loading =
    teamsQuery.isLoading || invQuery.isLoading || listsQuery.isLoading;

  const beginRename = (l) => {
    setListId(String(l.id));
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
          <h2>Créer un inventaire</h2>
          <div className="crud-toolbar">
            <select
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
            >
              <option value="">Équipe…</option>
              {(teamsQuery.data?.items ?? []).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-primary"
              disabled={!teamId || createInv.isPending}
              onClick={() => createInv.mutate()}
            >
              Créer inventaire
            </button>
          </div>
        </section>

        <section className="inventory-section">
          <h2>Inventaires</h2>
          {inventories.length === 0 ? (
            <EmptyState title="Aucun inventaire" />
          ) : (
            <select value={invId} onChange={(e) => setInvId(e.target.value)}>
              <option value="">Sélectionner…</option>
              {inventories.map((i) => (
                <option key={i.id} value={i.id}>
                  #{i.id} — équipe {i.teamId}
                </option>
              ))}
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
            <ul className="inventory-pill-list">
              {listsForInv.map((l) => (
                <li key={l.id}>
                  {editingListId === l.id ? (
                    <>
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
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className={`btn btn-secondary inventory-pill-list__select ${Number(listId) === l.id ? 'is-active' : ''}`}
                        onClick={() => setListId(String(l.id))}
                      >
                        {l.name}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary inventory-pill-list__action"
                        title="Renommer"
                        aria-label="Renommer"
                        onClick={() => beginRename(l)}
                      >
                        ✎
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger inventory-pill-list__action"
                        title="Supprimer"
                        aria-label="Supprimer"
                        onClick={() => {
                          if (window.confirm('Supprimer cette liste ?')) {
                            deleteList.mutate(l.id);
                          }
                        }}
                      >
                        ×
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {listId ? (
          <section className="inventory-section">
            <h2>Produits</h2>
            <div className="crud-toolbar">
              <input
                placeholder="Nom"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
              <input
                type="number"
                min={0}
                className="inventory-qty-input"
                value={productQty}
                onChange={(e) => setProductQty(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-primary"
                disabled={!productName.trim() || createProduct.isPending}
                onClick={() => createProduct.mutate()}
              >
                Ajouter
              </button>
            </div>
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
                  {productsForList.map((p) => (
                    <tr key={p.id}>
                      <td data-label="Nom">{p.name}</td>
                      <td data-label="Qté">{p.quantity}</td>
                      <td data-label="Actions" className="crud-table__actions">
                        <button
                          type="button"
                          className="btn btn-danger btn-compact"
                          onClick={() => {
                            if (window.confirm('Supprimer ce produit ?')) {
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
          </section>
        ) : null}
      </div>
    </AppPage>
  );
}

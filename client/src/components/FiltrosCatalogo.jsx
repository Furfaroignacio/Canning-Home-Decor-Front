// Barra de filtros horizontal. Las categorias son texto, no casillas: se lee
// como el indice de secciones de un catalogo y ocupa una sola linea.
const FiltrosCatalogo = ({
  categorias,
  categoriaId,
  onCategoria,
  texto,
  onTexto,
  precioMin,
  onPrecioMin,
  precioMax,
  onPrecioMax,
  hayFiltros,
  onLimpiar,
}) => (
  <div className="filtros">
    <div className="filtros__categorias" role="group" aria-label="Categorías">
      <button
        type="button"
        className={`filtro-cat${categoriaId === null ? ' filtro-cat--activo' : ''}`}
        onClick={() => onCategoria(null)}
      >
        Todo
      </button>

      {categorias.map((categoria) => (
        <button
          key={categoria.id}
          type="button"
          className={`filtro-cat${categoriaId === categoria.id ? ' filtro-cat--activo' : ''}`}
          onClick={() => onCategoria(categoria.id)}
        >
          {categoria.description}
        </button>
      ))}
    </div>

    <div className="filtros__controles">
      <div className="busqueda">
        <label className="oculto" htmlFor="buscar">
          Buscar una pieza
        </label>
        <input
          id="buscar"
          className="campo__control busqueda__control"
          type="search"
          placeholder="Buscar roble, lino, mesa"
          value={texto}
          onChange={(e) => onTexto(e.target.value)}
        />
      </div>

      <div className="rango">
        <label className="oculto" htmlFor="precio-min">
          Precio mínimo
        </label>
        <input
          id="precio-min"
          className="campo__control rango__control"
          type="number"
          min="0"
          placeholder="Desde"
          value={precioMin}
          onChange={(e) => onPrecioMin(e.target.value)}
        />

        <span className="rango__union" aria-hidden="true" />

        <label className="oculto" htmlFor="precio-max">
          Precio máximo
        </label>
        <input
          id="precio-max"
          className="campo__control rango__control"
          type="number"
          min="0"
          placeholder="Hasta"
          value={precioMax}
          onChange={(e) => onPrecioMax(e.target.value)}
        />
      </div>

      {hayFiltros && (
        <button type="button" className="boton boton--texto" onClick={onLimpiar}>
          Limpiar
        </button>
      )}
    </div>
  </div>
)

export default FiltrosCatalogo

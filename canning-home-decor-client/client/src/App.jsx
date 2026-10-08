import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import Layout from './components/Layout'
import SoloVisitantes from './components/SoloVisitantes'
import Login from './views/Login'
import Register from './views/Register'
import Home from './views/Home'
import NotFound from './views/NotFound'

// Mapa de rutas de toda la aplicacion.
//
// El catalogo es publico: cualquiera entra y mira. El login se pide recien
// para comprar o para administrar, y eso lo decide <ProtectedRoute>.
const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route
          path="/login"
          element={
            <SoloVisitantes>
              <Login />
            </SoloVisitantes>
          }
        />
        <Route
          path="/registro"
          element={
            <SoloVisitantes>
              <Register />
            </SoloVisitantes>
          }
        />

        <Route element={<Layout />}>
          {/* Publico */}
          <Route path="/" element={<Home />} />

          {/*
            A medida que se armen las pantallas se agregan aca.
            Las que llevan <ProtectedRoute> necesitan ademas su import:
            import ProtectedRoute from './components/ProtectedRoute'

            Publicas:
            <Route path="/productos/:id" element={<Detalle />} />

            Solo comprador:
            <Route path="/carrito" element={<ProtectedRoute rol="USER"><Carrito /></ProtectedRoute>} />
            <Route path="/mis-compras" element={<ProtectedRoute rol="USER"><MisCompras /></ProtectedRoute>} />

            Solo administrador:
            <Route path="/admin/productos" element={<ProtectedRoute rol="ADMIN"><AdminProductos /></ProtectedRoute>} />
            <Route path="/admin/categorias" element={<ProtectedRoute rol="ADMIN"><AdminCategorias /></ProtectedRoute>} />
            <Route path="/admin/usuarios" element={<ProtectedRoute rol="ADMIN"><AdminUsuarios /></ProtectedRoute>} />
          */}

          <Route path="/inicio" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
)

export default App

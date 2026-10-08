import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { CartProvider } from './context/CartProvider'
import IrArriba from './components/IrArriba'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import SoloVisitantes from './components/SoloVisitantes'
import Login from './views/Login'
import Register from './views/Register'
import Home from './views/Home'
import Catalogo from './views/Catalogo'
import Detalle from './views/Detalle'
import Carrito from './views/Carrito'
import MisCompras from './views/MisCompras'
import NotFound from './views/NotFound'

// Mapa de rutas de toda la aplicacion.
//
// El home, el catalogo y el detalle son publicos. El login se pide recien
// para comprar o para administrar, y eso lo decide ProtectedRoute.
const App = () => (
  <BrowserRouter>
    <IrArriba />
    <AuthProvider>
      <CartProvider>
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
            {/* Publicas */}
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/productos/:id" element={<Detalle />} />

            {/* Solo comprador */}
            <Route
              path="/carrito"
              element={
                <ProtectedRoute rol="USER">
                  <Carrito />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mis-compras"
              element={
                <ProtectedRoute rol="USER">
                  <MisCompras />
                </ProtectedRoute>
              }
            />

            {/*
              El panel de administracion va aca:

              <Route path="/admin/productos" element={<ProtectedRoute rol="ADMIN"><AdminProductos /></ProtectedRoute>} />
              <Route path="/admin/categorias" element={<ProtectedRoute rol="ADMIN"><AdminCategorias /></ProtectedRoute>} />
              <Route path="/admin/usuarios" element={<ProtectedRoute rol="ADMIN"><AdminUsuarios /></ProtectedRoute>} />
            */}

            <Route path="/inicio" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App

import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const githubRepoUrl = "https://github.com/hllous/FelsaniMotors-client";

  return (
    <footer className="bg-paleta1-cream">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sección: Sobre Felsani Motors */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-paleta1-blue text-lg font-bold mb-4">Felsani Motors</h3>
            <p className="text-gray-800 text-sm leading-relaxed mb-4 text-">
              Tu marketplace de confianza para la compra y venta de autos. 
              Conectamos compradores y vendedores de manera segura, fácil y eficiente.
            </p>
            <div className="flex space-x-4">
              <a 
                href={githubRepoUrl}
                target="_blank"
                rel="noopener noreferrer" 
                className="transition-all inline-flex items-center gap-2 px-3 py-2 rounded-lg text-paleta1-blue bg-paleta1-blue-light/30 hover:bg-paleta1-blue-light/50"
                aria-label="GitHub"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                </svg>
                <span className="text-sm font-medium">GitHub</span>
              </a>
            </div>
          </div>

          {/* Sección: Enlaces Rápidos */}
          <div>
            <h3 className="text-paleta1-blue text-lg font-bold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/publicaciones" 
                  className="text-gray-800 text-sm transition-colors hover:text-paleta1-blue hover:underline"
                >
                  Ver Autos
                </Link>
              </li>
              <li>
                <Link 
                  to="/crear-publicacion" 
                  className="text-gray-800 text-sm transition-colors hover:text-paleta1-blue hover:underline"
                >
                  Vender mi Auto
                </Link>
              </li>
              <li>
                <Link 
                  to="/faq" 
                  className="text-gray-800 text-sm transition-colors hover:text-paleta1-blue hover:underline"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Sección: Contacto */}
          <div>
            <h3 className="text-paleta1-blue text-lg font-bold mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm text-gray-800">
              <li className="flex items-start">
                <svg 
                  className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-paleta1-blue"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <a 
                  href="mailto:info@felsanimotors.com" 
                  className="text-gray-800 transition-colors hover:text-paleta1-blue hover:underline"
                >
                  info@felsanimotors.com
                </a>
              </li>
              <li className="flex items-start">
                <svg 
                  className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-paleta1-blue"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <span>+54 11 1234-5678</span>
              </li>
              <li className="flex items-start">
                <svg 
                  className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-paleta1-blue"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span>Buenos Aires, Argentina</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="mt-8 pt-8 border-t border-paleta1-blue-light">
          <div className="flex justify-center items-center">
            <p className="text-sm text-gray-800">
              © {currentYear} Felsani Motors. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
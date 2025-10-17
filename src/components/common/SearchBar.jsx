import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Filter from './Filter';

const SearchBar = () => {
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setSearchValue(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (searchValue.trim()) {
            navigate(`/publicaciones?q=${encodeURIComponent(searchValue.trim())}`);
        } else {
            navigate('/publicaciones');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-paleta1-cream rounded-b-full flex justify-center items-center h-14 transition-all duration-300 ease-in-out hover:h-20">
            <div className="ml-2">
                <Filter />
            </div>

            <input 
                type="text" 
                value={searchValue}
                onChange={handleChange}
                placeholder="Buscar autos usados, nuevos y mas..."
                className="w-1/5 h-max bg-paleta1-cream-light outline-none rounded-3xl text-left transition-all duration-300 ease-in-out hover:w-1/3 focus:w-1/3 px-4 py-2" 
            />
            
            <button type="submit" className="ml-2 p-2 hover:scale-110 transition-transform duration-200 text-gray-700 rounded-full hover:cursor-pointer hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </button>
        </form>
    );
};

export default SearchBar;
using ControleDespesas.Data; // chamando AppDbContext
using ControleDespesas.Models; // chamando as models
using Microsoft.EntityFrameworkCore;

namespace ControleDespesas.Repositories
{
    //Seperação de responsabilidades, no caso, apenas, para executar op no banco de dados
    public class CategoriaRepository
    {
        private readonly AppDbContext _context;

        //Injeção de dependencia
        public CategoriaRepository(AppDbContext context)
        {
            _context = context;
        }

        //Lista todas as categorias registradas
        public async Task<List<Categoria>> GetAll()
        {
            return await _context.Categorias.ToListAsync();
        }

        //Lista por id em categorias
        public async Task<Categoria?> GetById(int id)
        {
            return await _context.Categorias.FindAsync(id);
        }

        //Adiciona uma nova categoria
        public async Task<Categoria> Create(Categoria categoria)
        {
            _context.Categorias.Add(categoria);
            await _context.SaveChangesAsync();
            return categoria;
        }

        //Edita uma categoria existente
        public async Task<Categoria> Update(Categoria categoria)
        {
            _context.Categorias.Update(categoria);
            await _context.SaveChangesAsync();
            return categoria;
        }

        //Exclui uma categoria por id
        public async Task<bool> Delete (int id)
        {
            var categoria = await GetById(id);

            if (categoria == null)
            {
                return false;
            }
            _context.Categorias.Remove(categoria);
            await _context.SaveChangesAsync();
            return true;
        }


    }
}

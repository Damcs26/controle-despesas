using Microsoft.EntityFrameworkCore;
using ControleDespesas.Models;

namespace ControleDespesas.Data
{
    //Ponte entre API e Banco de Dados
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        
        //Representaçoes das Tabelas no Banco de Dados
          public DbSet<Categoria> Categorias { get; set; }
          public DbSet<Pessoa> Pessoas { get; set; }
          public DbSet<Transacao> Transacoes { get; set; }

    }
}

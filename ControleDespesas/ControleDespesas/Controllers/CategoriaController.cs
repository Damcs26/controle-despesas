using ControleDespesas.Models;
using ControleDespesas.Services;
using Microsoft.AspNetCore.Mvc;

namespace ControleDespesas.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriaController : ControllerBase
    {
        //Buscando as regras de negócio
        private readonly CategoriaService _service;

        public CategoriaController(CategoriaService service)
        {
            _service = service;
        }

        //GET - Listagem de todas as categorias
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categorias = await _service.GetAll();
            return Ok(categorias);
        }
        //GET - Buscar por Id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var categoria = await _service.GetById(id);

            if (categoria == null)
            {
                return NotFound("Categoria não encontrada.");
            }

            return Ok(categoria);
        }
        
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Categoria categoria)
        {
            try
            {
                var criada = await _service.Create(categoria);
                return CreatedAtAction(nameof(GetById), new { id = criada.Id }, criada);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Categoria categoria)
        {
            var atualizada = await _service.Update(id, categoria);

            if (atualizada == null)
            {
                return NotFound("Categoria não encontrada.");
            }

            return Ok(atualizada);
        }
        
        [HttpGet("totais")]
        public async Task<IActionResult> GetTotaisPorCategoria()
        {
            var resumo = await _service.GetTotaisPorCategoria();
            return Ok(resumo);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deletado = await _service.Delete(id);

            if (!deletado)
            {
                return NotFound("Categoria não encontrada.");
            }

            return NoContent();
        }

    }
}

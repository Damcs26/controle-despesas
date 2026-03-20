using ControleDespesas.Data;
using ControleDespesas.Repositories;
using ControleDespesas.Services;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.SwaggerGen;

var builder = WebApplication.CreateBuilder(args);

// Registra os controllers da API
builder.Services.AddControllers();
// Faz o Swagger e a API retornarem "Despesa" em vez de 0
builder.Services.AddControllers().AddJsonOptions(options => options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter()));

// Swagger para testar as rotas antes de criar o front
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Registro do DbContext usando PostgreSQL com a string no appsettings.json
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

//Builder dos arquivos
builder.Services.AddScoped<CategoriaRepository>();
builder.Services.AddScoped<CategoriaService>();
builder.Services.AddScoped<PessoaRepository>();
builder.Services.AddScoped<PessoaService>();
builder.Services.AddScoped<TransacaoRepository>();
builder.Services.AddScoped<TransacaoService>();

// Permite o acesso do frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// CORS
app.UseCors("FrontendPolicy");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
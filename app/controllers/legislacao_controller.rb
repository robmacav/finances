require 'net/http'

class LegislacaoController < ApplicationController
  
  def pesquisar_lei
  
  page       = (params[:page] || 1).to_i
per_page   = 10
start      = (page - 1) * per_page
termo      = params[:q].presence&.strip || "t"
palavras   = termo.downcase.split
categories = (params[:categories] || "").split(",").map(&:strip)
anos       = (params[:year] || "").split(",").map(&:strip)

q = if termo == "t"
      "*:*"
    else
      palavras.map { |p| "(identificador:#{p} OR titulo:#{p} OR texto:#{p})" }.join(" OR ")
    end

filtros = []
filtros << "categoria:(#{categories.join(' OR ')})" if categories.any?
filtros << "ano:(#{anos.join(' OR ')})" if anos.any?

sort_by = case params[:sort_by].to_i
          when 1
            termo == "t" ? "lei asc" : "score desc"
          when 2
            "publicacao desc"
          when 3
            "identificador asc"
          else
            "score desc"
          end

uri = URI("https://solr.dev.sefin.ro.gov.br/solr/legislacao/select")
uri.query = URI.encode_www_form({
  q: q,
  fq: filtros,
  start: start,
  rows: per_page,
  fl: "identificador,titulo,lei,ano,score",
  sort: sort_by
})

response = Net::HTTP.get(uri)
data = JSON.parse(response)

# paginação
num_found   = data["response"]["numFound"]
total_pages = (num_found.to_f / per_page).ceil

pagina_info = {
  current_page: page,
  per_page: per_page,
  total_count: num_found,
  total_pages: total_pages,
  has_previous: page > 1,
  has_next: page < total_pages,
  range_start: start + 1,
  range_end: [start + per_page, num_found].min
}

resultados = data["response"]["docs"].map do |doc|
  {
    identificador: doc["identificador"],
    titulo: doc["titulo"],
    lei: doc["lei"].to_i,
    ano: doc["ano"].to_i,
    score: doc["score"]
  }
end

render json: {
  pagina_info: pagina_info,
  resultados: resultados
}

  end

  def index
  
  end

  def detalhe

  end


  def pesquisar_detalhe_lei
  id = params[:id]

  lei = Lei.find_by(lei: id)

  if lei
    render json: {
      lei: lei.lei,
      identificador: lei.identificador,
      titulo: lei.titulo,
      ano: lei.ano,
      visivel: lei.visivel,
      publicado_em: lei.publicacao.strftime("%d/%m/%Y"),
      categoria_id: lei.categoria,
      texto_html: lei.texto # já vem com HTML
    }
  else
    render json: { error: "Lei não encontrada" }, status: :not_found
  end
end
  

  def pesquisar_leis_mais
    leis = LeiAcessada.joins(:lei)
                    .select("LEIS_ACESSADAS.lei, LEIS_ACESSADAS.qt_acesso, LEI.identificador")
                    .order("LEIS_ACESSADAS.qt_acesso DESC")
                    .limit(10)

    render json: {
      pagina_info: "Top 10 leis mais acessadas",
      resultados: leis.map { |l| 
        {
          lei: l.lei.lei.to_i,
          identificador: l.identificador,
          qt_acesso: l.qt_acesso
        }
      }
    }
  end

  def link_arquivo
  id = params[:id]
  arquivos = Arquivo.where(lei_fk: id)

  if arquivos.exists?
    render json: {
      pagina_info: "Link Arquivos",
      resultados: arquivos.map { |arquivo|
        {
          nome: arquivo.nome,
          extensao: arquivo.extensao,
          nomeservidor: arquivo.nomeservidor
        }
      }
    }
  else
    render json: { error: "Arquivos não encontrados" }, status: :not_found
  end
end

end

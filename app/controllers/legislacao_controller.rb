class LegislacaoController < ApplicationController
  
  def pesquisar_lei
  
    # parâmetros de paginação
    page = (params[:page] || 1).to_i
    per_page = 10
    start_row = (page - 1) * per_page + 1
    end_row   = start_row + per_page - 1

    termo = params[:q].presence&.strip || "t"
    p "!!!!!!!!!!!!!!!!!!!!!!!!!! #{termo} #{page} !!!!!!!!!!!!!!!!!!!!!!!!!"
    termo_downcase = termo.downcase
    palavras = termo_downcase.split
    contains_expr = palavras.map { |p| "\"#{p}\"" }.join(" OR ")

    # score por palavra no IDENTIFICADOR
    score_cases = palavras.map.with_index(1) do |p, i|
      "CASE WHEN LOWER(l.IDENTIFICADOR) LIKE LOWER(:palavra#{i}) THEN 4 ELSE 0 END"
    end.join(" + ")

     # score por palavra no IDENTIFICADOR
    score_cases_titulo = palavras.map.with_index(1) do |p, i|
      "CASE WHEN LOWER(l.titulo) LIKE LOWER(:palavra#{i}) THEN 3 ELSE 0 END"
    end.join(" + ")

    # where por palavra no IDENTIFICADOR
    where_conditions = palavras.map.with_index(1) do |p, i|
      "LOWER(l.IDENTIFICADOR) LIKE LOWER(:palavra#{i})"
    end.join(" OR ")

    where_conditions_titulo = palavras.map.with_index(1) do |p, i|
      "LOWER(l.titulo) LIKE LOWER(:palavra#{i})"
    end.join(" OR ")

    categories = (params[:categories] || "").split(",").map(&:strip)

    category_filter = if categories.any?
      "AND l.CATEGORIA IN (:categories)"
    else
      ""
    end

    score_case_texto = ""
    score_case_texto = "+ CASE WHEN CONTAINS(l.TEXTO, :termo_completo, 9) > 0 THEN 9 ELSE 0 END" unless termo_downcase == 't'

    anos = (params[:year] || "").split(",").map(&:strip)

    anos_filter = if anos.any?
      "AND l.ano IN (:anos)"
    else
      ""
    end


  sort_by = params[:sort_by].to_i
  # Definir a cláusula ORDER BY de acordo com sort_by
  order_by_clause = case sort_by
                  when 1
                    if termo == 't'
                      "l.lei ASC"   # quando é 't', ordena por lei
                    else
                      "score DESC"            # busca normal, ordena por relevância
                    end
                  when 2
                    "l.publicacao DESC"
                  when 3
                    "l.identificador ASC"  # padrão
                  else
                    "score DESC"  # padrão
                  end

    # SQL com ROW_NUMBER() para paginação
    sql = <<-SQL
        SELECT *
        FROM (
          SELECT subquery.*, ROWNUM AS rn
          FROM (
            SELECT l.*,
                   (
                    CASE WHEN LOWER(l.IDENTIFICADOR) LIKE LOWER(:termo_completo) THEN 10 ELSE 0 END
                    + CASE WHEN LOWER(l.TITULO) LIKE LOWER(:termo_completo) THEN 9 ELSE 0 END
                    #{score_case_texto}
                    + #{score_cases}
                    + #{score_cases_titulo}
                   ) AS score
            FROM SITESEFIN.LEI l
            WHERE l.visivel = 'SIM'
              AND (:termo = 't'
                   OR CONTAINS(l.TEXTO, :contains_expr, 2) > 0
                   OR LOWER(l.IDENTIFICADOR) LIKE LOWER(:termo_completo)
                   OR LOWER(l.titulo) LIKE LOWER(:termo_completo)
                   OR #{where_conditions_titulo}
                   OR #{where_conditions})
              #{category_filter}
              #{anos_filter}
            ORDER BY #{order_by_clause}
          ) subquery
          WHERE ROWNUM <= :end_row
        )
        WHERE rn >= :start_row
    SQL

    # binds
    binds = { termo: termo, termo_completo: "%#{termo_downcase}%" }
    palavras.each_with_index do |p, i|
      binds[:"palavra#{i+1}"] = "%#{p}%"
    end
    binds[:start_row] = start_row
    binds[:end_row]   = end_row
    binds[:contains_expr]   = contains_expr
    binds[:categories]   = categories
    binds[:anos]   = anos

    # executa
    resultados = Lei.find_by_sql([sql, binds])


    # cálculo do total de páginas
    count_sql = <<-SQL
      SELECT COUNT(*) AS total_count
        FROM SITESEFIN.LEI l
        WHERE l.visivel = 'SIM'
              AND (:termo = 't'
                   OR CONTAINS(l.TEXTO, :contains_expr, 2) > 0
                   OR LOWER(l.IDENTIFICADOR) LIKE LOWER(:termo_completo)
                   OR LOWER(l.titulo) LIKE LOWER(:termo_completo)
                   OR #{where_conditions_titulo}
                   OR #{where_conditions})
              #{category_filter}
              #{anos_filter}
    SQL

    total_count = Lei.find_by_sql([count_sql, binds])[0].total_count.to_i
    total_pages = (total_count.to_f / per_page).ceil

    # informações de paginação
    pagina_info = {
      current_page: page,
      per_page: per_page,
      total_count: total_count,
      total_pages: total_pages,
      has_previous: page > 1,
      has_next: page < total_pages,
      range_start: start_row,
      range_end: [end_row, total_count].min
    }


    resultados.each do |l|
      puts "#{l.identificador} - #{l.ano} - #{l.lei} (score: #{l.score})"
    end

    puts "Página #{pagina_info[:current_page]} de #{pagina_info[:total_pages]}"
    puts "Mostrando #{pagina_info[:range_start]} a #{pagina_info[:range_end]} de #{pagina_info[:total_count]} resultados"
    puts "Anterior habilitado? #{pagina_info[:has_previous]}"
    puts "Próximo habilitado? #{pagina_info[:has_next]}"


    # resultados formatados
    resultados_json = resultados.map do |l|
      {
        identificador: l.identificador,
        titulo: l.titulo,
        lei: l.lei.to_i,
        score: l.score,
        ano: l.ano.to_i
      }
    end

    # retorno final em JSON
    render json: {
      pagina_info: pagina_info,
      resultados:  resultados_json
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

class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  def pagina_inicial
    @leis = Lei.order(publicacao: :desc).limit(4)

    # filtros rapidos
    @anos_disponiveis = Lei.distinct.pluck(Arel.sql('EXTRACT(YEAR FROM publicacao)')).map(&:to_i).sort.reverse.first(8)
  end
end

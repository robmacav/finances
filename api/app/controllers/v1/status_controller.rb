class V1::StatusController < ApplicationController
  def index
    @statuses = Status.page(params[:page]).per(params[:per_page] || 50)

    render json: {
      current_page: @statuses.current_page,
      total_pages: @statuses.total_pages,
      total_count: @statuses.total_count,
      statuses: @statuses
    }
  end
end
class V1::CategoriesController < ApplicationController
  before_action :set_category, only: %i[ show update destroy ]

  def index
    @categories = Category.page(params[:page]).per(params[:per_page] || 50)

    render json: {
      current_page: @categories.current_page,
      total_pages: @categories.total_pages,
      total_count: @categories.total_count,
      categories: @categories
    }
  end

  def show
    render json: @category
  end

  def create
    @category = Category.new(category_params)

    if @category.save
      render json: @category, status: :created, location: @category
    else
      render json: @category.errors, status: :unprocessable_entity
    end
  end

  def update
    if @category.update(category_params)
      render json: @category
    else
      render json: @category.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @category.destroy!
  end

  private
    def set_category
      @category = Category.find(params[:id])
    end

    def category_params
      params.permit(:summary, :color, :icon, :user_id)
    end
end

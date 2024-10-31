class ExpenseCategoriesController < ApplicationController
  before_action :set_category, only: [ :update, :edit, :destroy ]

  def index
    @q = ExpenseCategory.ransack(params[:q])
    @pagy, @categories = pagy(@q.result, items: params[:per_page] || 5)
  end

  def new
    @category = ExpenseCategory.new
  end

  def create
    @category = ExpenseCategory.new(category_params)

    respond_to do |format|
      if @category.save
        format.html { redirect_to expense_categories_path, notice: "Categoria cadastrada com sucesso." }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @categories.errors, status: :unprocessable_entity }
        format.turbo_stream { render :form_update, status: :unprocessable_entity }
      end
    end
  end

  def edit; end

  def update
    respond_to do |format|
      if @category.update(category_params)
        format.html { redirect_to expense_categories_path, notice: "Categoria atualizada com sucesso." }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @category.errors, status: :unprocessable_entity }
        format.turbo_stream { render :form_update, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    if @category.destroy
      redirect_to expense_categories_path, notice: "Categoria excluída com sucesso."
    else
      redirect_to expense_categories_path, notice: "Ocorreu um erro. Tente novamente ou contate o suporte."
    end
  end

  private

  def set_category
    @category = ExpenseCategory.find(params[:id])
  end

  def category_params
    params.require(:expense_category).permit(:description, :color).merge(user_id: 1)
  end
end

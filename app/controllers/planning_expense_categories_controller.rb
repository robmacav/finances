class PlanningExpenseCategoriesController < ApplicationController
    before_action :set_category, only: [ :update, :edit, :destroy ]
  
    def new
      @category = PlanningExpenseCategory.new(planning_id: params[:planning_id])
    end
  
    def create
      @category = PlanningExpenseCategory.new(category_params)
  
      respond_to do |format|
        if @category.save
          format.html { redirect_to planning_expense_categories_path, notice: "Categoria cadastrada com sucesso." }
        else
          format.html { render :new, status: :unprocessable_entity }
          format.json { render json: @category.errors, status: :unprocessable_entity }
          format.turbo_stream { render :form_update, status: :unprocessable_entity }
        end
      end
    end
  
    def edit
    end
  
    def update
      respond_to do |format|
        if @category.update(category_params)
          format.html { redirect_to planning_expense_categories_path, notice: "Categoria atualizada com sucesso." }
        else
          format.html { render :new, status: :unprocessable_entity }
          format.json { render json: @category.errors, status: :unprocessable_entity }
          format.turbo_stream { render :form_update, status: :unprocessable_entity }
        end
      end
    end
  
    def destroy
      if @category.destroy
        redirect_to planning_expense_categories_path, notice: "Categoria excluída com sucesso."
      else
        redirect_to planning_expense_categories_path, notice: "Ocorreu um erro. Tente novamente ou contate o suporte."
      end
    end
  
    private
  
    def set_category
      @category = PlanningExpenseCategory.find(params[:id])
    end
  
    def category_params
      params.require(:planning_expense_category).permit(:description, :color, :planning_id)
    end
  end
  
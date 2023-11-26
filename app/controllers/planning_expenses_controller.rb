class PlanningExpensesController < ApplicationController
    before_action :set_expense, only: [ :update, :edit, :destroy ]
    before_action :normalization_params, only: [ :create, :update ]

    def new
      @category = PlanningExpenseCategory.find(params[:category_id])
      @expense = PlanningExpense.new(planning_expense_category_id: @category.id)
    end
  
    def create
      @expense = PlanningExpense.new(expense_params)
  
      respond_to do |format|
        if @expense.save
          format.html { redirect_to planning_expenses_path, notice: "Despesa cadastrada com sucesso." }
        else
          format.html { render :new, status: :unprocessable_entity }
          format.json { render json: @expense.errors, status: :unprocessable_entity }
          format.turbo_stream { render :form_update, status: :unprocessable_entity }
        end
      end
    end
  
    def edit
      @expense.value = @expense.value_decimal_to_float
    end
  
    def update
      respond_to do |format|
        if @expense.update(expense_params)
          format.html { redirect_to planning_expenses_path, notice: "Despesa atualizado com sucesso." }
        else
          format.html { render :new, status: :unprocessable_entity }
          format.json { render json: @expense.errors, status: :unprocessable_entity }
          format.turbo_stream { render :form_update, status: :unprocessable_entity }
        end
      end
    end
  
    def destroy
      if @expense.destroy
        redirect_to planning_expenses_path, notice: "Despesa excluído com sucesso."
      else
        redirect_to planning_expenses_path, notice: "Ocorreu um erro. Tente novamente ou contate o suporte."
      end
    end
  
    private

    def normalization_params
      params[:planning_expense][:value] = convert_float_to_decimal(params[:planning_expense][:value])
    end
  
    def set_expense
      @expense = PlanningExpense.find(params[:id])
    end
  
    def expense_params
      params.require(:planning_expense).permit(:description, :value, :quantity, :planning_expense_category_id)
    end
  end
  
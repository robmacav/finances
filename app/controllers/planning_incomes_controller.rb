class PlanningIncomesController < ApplicationController
    before_action :set_income, only: [ :update, :edit, :destroy ]

    def index
      @incomes = PlanningIncome.where(planning_id: params[:planning_id])
    end
  
    def new
      @income = PlanningIncome.new(planning_id: params[:planning_id])
    end
  
    def create
      @income = PlanningIncome.new(income_params)
  
      respond_to do |format|
        if @income.save
          format.html { redirect_to planning_incomes_path(planning_id: @income.planning_id), notice: "Receita cadastrada com sucesso." }
        else
          format.html { render :new, status: :unprocessable_entity }
          format.json { render json: @income.errors, status: :unprocessable_entity }
          format.turbo_stream { render :form_update, status: :unprocessable_entity }
        end
      end
    end
  
    def edit
    end
  
    def update
      respond_to do |format|
        if @income.update(income_params)
          format.html { redirect_to planning_incomes_path(planning_id: @income.planning_id), notice: "Receita atualizada com sucesso." }
        else
          format.html { render :new, status: :unprocessable_entity }
          format.json { render json: @income.errors, status: :unprocessable_entity }
          format.turbo_stream { render :form_update, status: :unprocessable_entity }
        end
      end
    end
  
    def destroy
      if @income.destroy
        redirect_to planning_incomes_path(planning_id: @income.planning_id), notice: "Receita excluída com sucesso."
      else
        redirect_to planning_incomes_path(planning_id: @income.planning_id), notice: "Ocorreu um erro. Tente novamente ou contate o suporte."
      end
    end
  
    private

    def set_income
      @income = PlanningIncome.find(params[:id].to_i)
    end
  
    def income_params
      params.require(:planning_income).permit(:description, :value, :planning_id)
    end
  end
  
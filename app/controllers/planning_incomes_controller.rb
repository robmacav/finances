class PlanningIncomesController < ApplicationController
    before_action :set_income, only: [ :update, :edit, :destroy ]
    before_action :normalization_params, only: [ :create, :update ]

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
          format.html { redirect_to planning_path(@income.planning_id), notice: "Receita cadastrada com sucesso." }
        else
          format.html { render :new, status: :unprocessable_entity }
          format.json { render json: @income.errors, status: :unprocessable_entity }
          format.turbo_stream { render :form_update, status: :unprocessable_entity }
        end
      end
    end
  
    def edit
      @income.value = @income.value_decimal_to_float
    end
  
    def update
      respond_to do |format|
        if @income.update(income_params)
          format.html { redirect_to planning_path(@income.planning_id), notice: "Receita atualizada com sucesso." }
        else
          format.html { render :new, status: :unprocessable_entity }
          format.json { render json: @income.errors, status: :unprocessable_entity }
          format.turbo_stream { render :form_update, status: :unprocessable_entity }
        end
      end
    end
  
    def destroy
      if @income.destroy
        redirect_to planning_path(@income.planning_id), notice: "Receita excluída com sucesso."
      else
        redirect_to planning_path(@income.planning_id), notice: "Ocorreu um erro. Tente novamente ou contate o suporte."
      end
    end
  
    private

    def normalization_params
      params[:planning_income][:value] = convert_float_to_decimal(params[:planning_income][:value])
    end

    def set_income
      @income = PlanningIncome.find(params[:id])
    end
  
    def income_params
      params.require(:planning_income).permit(:description, :value, :planning_id)
    end
  end
  
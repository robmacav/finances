class PlanningsController < ApplicationController
  before_action :set_planning, only: [ :edit, :update, :destroy ]
  
  def index
    @plannings = Planning.all
  end

  def show
    @planning = Planning.includes(:expense_categories, :expenses, :incomes).find(params[:id])
  end

  def new
    @planning = Planning.new
  end

  def create
    @planning = Planning.new(planning_params)

    respond_to do |format|
      if @planning.save
        format.html { redirect_to plannings_path, notice: "Planejamento cadastrado com sucesso." }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @planning.errors, status: :unprocessable_entity }
        format.turbo_stream { render :form_update, status: :unprocessable_entity }
      end
    end
  end

  def edit
  end

  def update
    respond_to do |format|
      if @planning.update(planning_params)
        format.html { redirect_to plannings_path, notice: "Planejamento atualizado com sucesso." }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @planning.errors, status: :unprocessable_entity }
        format.turbo_stream { render :form_update, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    if @planning.destroy
      redirect_to plannings_path, notice: "Planejamento excluído com sucesso."
    else
      redirect_to plannings_path, notice: "Ocorreu um erro. Tente novamente ou contate o suporte."
    end
  end

  private

  def set_planning
    @planning = Planning.find(params[:id])
  end

  def planning_params
    params.require(:planning).permit(:month_year).merge(user_id: 1)
  end
end

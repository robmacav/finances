class TagsController < ApplicationController
  def index
    @q = Tag.ransack(params[:q])
    @pagy, @tags = pagy(@q.result, items: params[:per_page] || 5)
  end

  def new
    @tag = Tag.new
  end

  def create
    @tag = Tag.new(tag_params)
  
    respond_to do |format|
      if @tag.save
        format.html { redirect_to tags_path, notice: "Tag cadastrada com sucesso." }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @tag.errors, status: :unprocessable_entity }
        format.turbo_stream { render :form_update, status: :unprocessable_entity }
      end
    end
  end

  def edit
  end

  def update
    respond_to do |format|
      if @tag.update(tag_params)
        format.html { redirect_to tags_path, notice: "Tag atualizada com sucesso." }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @tag.errors, status: :unprocessable_entity }
        format.turbo_stream { render :form_update, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    if @tag.destroy
      redirect_to tags_path, notice: "Tag excluída com sucesso."
    else
      redirect_to tags_path, notice: "Ocorreu um erro. Tente novamente ou contate o suporte."
    end
  end

  private

  def set_tag
    @tag = Tag.find(params[:id])
  end

  def tag_params
    params.require(:tag).permit(:description).merge(user_id: current_user.id)
  end
end

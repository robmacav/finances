import 'package:flutter/material.dart';
import 'edit_profile_page.dart'; // importa sua tela de edição de perfil

class AccountPage extends StatelessWidget {
  const AccountPage({super.key});
  

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        child: Column(
          children: [
            const SizedBox(height: 20),

            // Logo e nome do usuário
            Column(
              children: [
                Icon(Icons.account_circle, size: 80, color: Colors.white70),
                const SizedBox(height: 8),
                const Text(
                  "Robson Cavalcante",
                  style: TextStyle(
                    fontSize: 20,
                    color: Colors.white,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),

            const SizedBox(height: 24),

            // Botões em grade
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: GridView.count(
                crossAxisCount: 2,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                children: [
                  _buildGridButton(
                    context,
                    Icons.person_outline,
                    "editar perfil",
                    () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                          builder: (context) => const EditProfilePage(),
                        ),
                      );
                    },
                  ),
                  _buildGridButton(
                    context,
                    Icons.grid_view_outlined,
                    "minhas categorias",
                    () {},
                  ),
                  _buildGridButton(
                    context,
                    Icons.blur_circular_outlined,
                    "minhas subcategorias",
                    () {},
                  ),
                  _buildGridButton(
                    context,
                    Icons.track_changes_outlined,
                    "metas",
                    () {},
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Lista de opções
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                children: [
                  _buildListTile(Icons.settings_outlined, "configurações"),
                  _buildListTile(Icons.description_outlined, "termos de uso"),
                  _buildListTile(Icons.logout_outlined, "sair"),
                ],
              ),
            ),

            // Versão no rodapé
            Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: Text(
                "Versão: 1.0.27 (1027)",
                style: TextStyle(color: Colors.grey.shade500, fontSize: 12),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGridButton(
    BuildContext context,
    IconData icon,
    String label,
    VoidCallback onTap,
  ) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1E1E1E),
        borderRadius: BorderRadius.circular(12),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: onTap,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 28, color: Colors.white),
            const SizedBox(height: 8),
            Text(
              label,
              style: const TextStyle(color: Colors.white, fontSize: 14),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildListTile(IconData icon, String label) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: const Color(0xFF1E1E1E),
        borderRadius: BorderRadius.circular(12),
      ),
      child: ListTile(
        leading: Icon(icon, color: Colors.white),
        title: Text(label, style: const TextStyle(color: Colors.white)),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey),
        onTap: () {
          // ação do item
        },
      ),
    );
  }
}

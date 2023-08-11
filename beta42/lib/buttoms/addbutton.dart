import 'package:beta_app/Screen/Dialogs.dart';
import 'package:beta_app/Screen/scanner.dart';
import 'package:beta_app/custom_rect_tween.dart';
import 'package:beta_app/style.dart';
import 'package:flutter/material.dart';
import 'package:beta_app/route.dart';
/// {@template add_todo_button}
/// Button to add a new [Todo].
///
/// Opens a [HeroDialogRoute] of [_AddTodoPopupCard].
///
/// Uses a [Hero] with tag [_heroAddTodo].
/// {@endtemplate}
class AddTodoButton extends StatelessWidget {
  /// {@macro add_todo_button}
  const AddTodoButton({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
      return GestureDetector(
        onTap: () {
          Navigator.of(context).push(HeroDialogRoute(builder: (context) {
            return const _AddTodoPopupCard();
          }));
        },
        child: Hero(
          tag: _heroAddTodo,
          createRectTween: (begin, end) {
            return CustomRectTween(begin: begin, end: end);
          },
          child: Material(
            color: red,
            elevation: 2,
            shape:
            RoundedRectangleBorder(borderRadius: BorderRadius.circular(32)),
            child: const Icon(
              Icons.add_rounded,
              size: 36,
            ),
          ),
        ),
      );
  }
}

/// Tag-value used for the add todo popup button.
const String _heroAddTodo = 'add-todo-hero';

/// {@template add_todo_popup_card}
/// Popup card to add a new [Todo]. Should be used in conjuction with
/// [HeroDialogRoute] to achieve the popup effect.
///
/// Uses a [Hero] with tag [_heroAddTodo].
/// {@endtemplate}
class _AddTodoPopupCard extends StatelessWidget {
  /// {@macro add_todo_popup_card}
  const _AddTodoPopupCard({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32.0),
        child: Hero(
          tag: _heroAddTodo,
          createRectTween: (begin, end) {
            return CustomRectTween(begin: begin, end: end);
          },
          child: Material(
            color: red,
            elevation: 2,
            shape:
            RoundedRectangleBorder(borderRadius: BorderRadius.circular(32)),
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    IconButton(icon: Icon(Icons.precision_manufacturing_outlined,color: script,), onPressed: () {
                      Navigator.push(
                              context,
                              MaterialPageRoute(
                              builder: (context) => scannerScreen()));
                    }),
                    IconButton(icon: Icon(Icons.people,color: script,), onPressed: () async {
                        final action_1 = await Dialogs.yesAbortDialog(context, 'Person Hinzufügen', 'Gebe hier bitte die Daten der Person ein','Name','Mac-Adress');
                    }),
                    IconButton(icon: Icon(Icons.room_preferences,color: script,), onPressed: () async {
                        final action_2 = await Dialogs.yesAbortDialog(context, 'Raum Hinzufügen', ' Gebe hier bitte die Daten von dem Raum ein','Id','Raum-Name');
                    })
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
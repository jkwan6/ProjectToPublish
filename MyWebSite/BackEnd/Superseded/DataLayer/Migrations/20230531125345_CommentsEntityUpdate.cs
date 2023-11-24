using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataLayer.Migrations
{
    public partial class CommentsEntityUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Comments_parentCommentId",
                table: "Comments");

            migrationBuilder.RenameColumn(
                name: "parentCommentId",
                table: "Comments",
                newName: "ParentId");

            migrationBuilder.RenameIndex(
                name: "IX_Comments_parentCommentId",
                table: "Comments",
                newName: "IX_Comments_ParentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Comments_ParentId",
                table: "Comments",
                column: "ParentId",
                principalTable: "Comments",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Comments_ParentId",
                table: "Comments");

            migrationBuilder.RenameColumn(
                name: "ParentId",
                table: "Comments",
                newName: "parentCommentId");

            migrationBuilder.RenameIndex(
                name: "IX_Comments_ParentId",
                table: "Comments",
                newName: "IX_Comments_parentCommentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Comments_parentCommentId",
                table: "Comments",
                column: "parentCommentId",
                principalTable: "Comments",
                principalColumn: "Id");
        }
    }
}

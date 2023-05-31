using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataLayer.Migrations
{
    public partial class CommentRecursive : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SubComments");

            migrationBuilder.AddColumn<int>(
                name: "parentCommentId",
                table: "Comments",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Comments_parentCommentId",
                table: "Comments",
                column: "parentCommentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Comments_parentCommentId",
                table: "Comments",
                column: "parentCommentId",
                principalTable: "Comments",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Comments_parentCommentId",
                table: "Comments");

            migrationBuilder.DropIndex(
                name: "IX_Comments_parentCommentId",
                table: "Comments");

            migrationBuilder.DropColumn(
                name: "parentCommentId",
                table: "Comments");

            migrationBuilder.CreateTable(
                name: "SubComments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CommentsID = table.Column<int>(type: "int", nullable: false),
                    Author = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CommentsDescription = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubComments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SubComments_Comments_CommentsID",
                        column: x => x.CommentsID,
                        principalTable: "Comments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SubComments_CommentsID",
                table: "SubComments",
                column: "CommentsID");
        }
    }
}

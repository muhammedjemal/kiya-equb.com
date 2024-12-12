export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [],
  session: {
    strategy: "jwt", // Use JWT for session management
    maxAge: 3600, // 1 hr in seconds
  },
  callbacks: {
    // FOR MORE DETAIL ABOUT CALLBACK FUNCTIONS CHECK https://next-auth.js.org/configuration/callbacks
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isSystemAdmin = user.isSystemAdmin;
        token.oprator = user.oprator;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.collectorOf = user.collectorOf;
        token.managerMembers = user.managerMembers;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.isSystemAdmin = token.isSystemAdmin;
        session.user.oprator = token.oprator;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.collectorOf = token.collectorOf;
        session.user.managerMembers = token.managerMembers;
      }
      return session;
    },
    authorized({ auth, request }) {
      const user = auth?.user;
      const isOnAdminPanel = request.nextUrl?.pathname.startsWith("/admin");
      // const isOnBlogPage = request.nextUrl?.pathname.startsWith("/blog");
      const isOnAdminPage = request.nextUrl?.pathname.startsWith("/admin");
      const isOnLoginPage = request.nextUrl?.pathname.startsWith("/login");
      const isOnTransaction = request.nextUrl?.pathname.startsWith(
        "/admin/transactions"
      );

      // // ONLY ADMIN or collector or manager CAN REACH THE ADMIN DASHBOARD

      // if (
      //   isOnAdminPanel &&
      //   (!user?.isSystemAdmin ||
      //     (user.collectorOf === null && user.managerMembers === null))
      // ) {
      //   // return false;
      // }
      // ONLY ADMIN, COLLECTOR, OR MANAGER CAN REACH THE ADMIN DASHBOARD

      if (
        isOnAdminPanel &&
        !(
          user?.isSystemAdmin ||
          user?.collectorOf !== null ||
          user?.managerMembers !== null
        )
      ) {
        return false; // Redirect to the login page or an unauthorized  page
      }
      if (
        isOnTransaction &&
        !(user?.isSystemAdmin === true && user?.oprator === false)
      ) {
        return false; // Redirect to the login page or an unauthorized  page
      }

      // ONLY AUTHENTICATED USERS CAN REACH THE BLOG PAGE

      if (isOnAdminPage && !user) {
        return false;
      }

      // ONLY UNAUTHENTICATED USERS CAN REACH THE LOGIN PAGE

      if (isOnLoginPage && user) {
        return Response.redirect(new URL("/", request.nextUrl));
      }

      return true;
    },
  },
};

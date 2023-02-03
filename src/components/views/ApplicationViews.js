import { Profile } from "../Profile/Profile"
import { Route, Routes, Outlet } from "react-router-dom"
import { Watchlist } from "../Titles/Watchlist"
import { TitleList } from "../Titles/TitleList"
import { TitleDetails } from "../Titles/TitleDetails"

export const ApplicationViews = () => {
	return (
		<Routes>
			<Route path="/" element={
				<>
					<h1>VPNetflix</h1>
					<Outlet />
				</>
			}>
				<Route path="" element={<TitleList />} />
				<Route path="details/:titleId" element={<TitleDetails />} />
				<Route path="profile" element={<Profile />} />
				<Route path="watchlist" element={<Watchlist />} />
			</Route>
		</Routes>
	)
}
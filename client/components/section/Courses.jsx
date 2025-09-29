
import Folder from "../ui/folder"
import { Button } from "../ui/button"
import { Plus } from "lucide-react"

export function Courses() {
  const courses = [
    {
      id: 1,
      title: "HTML",
      description: "Web markup language",
      chapters: [
        { chapter: "Intro", content: "What is HTML?" },
        { chapter: "Tags", content: "HTML tags explained" },
        { chapter: "Forms", content: "Form basics" },
      ],
    },
    {
      id: 2,
      title: "Math",
      description: "Mathematics fundamentals",
      chapters: [
        { chapter: "Algebra", content: "Intro to algebra" },
        { chapter: "Geometry", content: "Basic shapes and formulas" },
        { chapter: "Calculus", content: "Derivatives and integrals" },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <Button
          className="flex items-center gap-2 w-full sm:w-auto text-sm sm:text-base bg-[#0b2a45] hover:bg-[#1c6592]"
          size="sm"
        >
          <Plus className="h-4 w-4 text-white" />
          <span className="sm:inline text-white">Add Course</span>
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex flex-col items-center text-center p-3 sm:p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer mt-10"
          >
           
            <Folder size={1.2} color="#4a9fe8" items={course.chapters} />

            <div className="mt-8 sm:mt-10">
              <h3 className="text-xs sm:text-sm md:text-base font-semibold text-foreground leading-tight">
                {course.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-tight hidden sm:block">
                {course.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
